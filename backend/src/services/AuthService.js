import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import clienteRepository from "../repositories/ClienteRepository.js";
import { BadRequestError, ConflictError, UnauthorizedError } from "../exceptions/AppError.js";
import { createAuthToken } from "../utils/authToken.js";

const scrypt = promisify(scryptCallback);
const PASSWORD_KEY_LENGTH = 64;

class AuthService {
    async register(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const nombre = typeof data.nombre === "string" ? data.nombre.trim() : "";
        const mail = typeof data.mail === "string" ? data.mail.trim().toLowerCase() : "";
        const password = data.password;

        if(!nombre || nombre.length > 100){
            throw new BadRequestError("El nombre es obligatorio y no puede superar los 100 caracteres.");
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
            throw new BadRequestError("Ingresa un email válido.");
        }

        if(typeof password !== "string" || password.length < 8 || password.length > 128){
            throw new BadRequestError("La contraseña debe tener entre 8 y 128 caracteres.");
        }

        if(clienteRepository.findByMail(mail)){
            throw new ConflictError("Ya existe una cuenta con ese email.");
        }

        const passwordSalt = randomBytes(16).toString("hex");
        const passwordHash = await scrypt(password, passwordSalt, PASSWORD_KEY_LENGTH);
        const cliente = clienteRepository.createAccount({
            nombre,
            mail,
            saldo: 0,
            passwordHash: passwordHash.toString("hex"),
            passwordSalt
        });

        if(!cliente) throw new ConflictError("Ya existe una cuenta con ese email.");

        return this.#createSession(cliente);
    }

    async login(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const mail = typeof data.mail === "string" ? data.mail.trim().toLowerCase() : "";
        const password = data.password;
        const cliente = clienteRepository.findByMail(mail);

        if(!cliente || !cliente.passwordHash || !cliente.passwordSalt || typeof password !== "string"){
            throw new UnauthorizedError("Email o contraseña incorrectos.");
        }

        const candidateHash = await scrypt(password, cliente.passwordSalt, PASSWORD_KEY_LENGTH);
        const savedHash = Buffer.from(cliente.passwordHash, "hex");
        if(candidateHash.length !== savedHash.length || !timingSafeEqual(candidateHash, savedHash)){
            throw new UnauthorizedError("Email o contraseña incorrectos.");
        }

        return this.#createSession(cliente);
    }

    getUser(userId){
        const cliente = clienteRepository.findById(userId);
        if(!cliente) throw new UnauthorizedError("La sesión no es válida o expiró.");
        return cliente;
    }

    #createSession(cliente){
        return {
            token: createAuthToken(cliente.id),
            user: cliente
        };
    }
}

export default new AuthService();