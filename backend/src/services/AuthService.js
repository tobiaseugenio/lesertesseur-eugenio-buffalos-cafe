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
            throw new BadRequestError("El nombre es obligatorio y no puede superar los 100 caracteres.", "nombre");
        }

        if(mail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)){
            throw new BadRequestError("Ingresa un email válido de hasta 254 caracteres.", "mail");
        }

        if(typeof password !== "string" || password.length < 8 || password.length > 128){
            throw new BadRequestError("La contraseña debe tener entre 8 y 128 caracteres.", "password");
        }

        if(await clienteRepository.findByMail(mail)){
            throw new ConflictError("Ya existe una cuenta con ese email.", "mail");
        }

        const passwordSalt = randomBytes(16).toString("hex");
        const passwordHash = await scrypt(password, passwordSalt, PASSWORD_KEY_LENGTH);
        const cliente = await clienteRepository.createAccount({
            nombre,
            mail,
            saldo: 0,
            passwordHash: passwordHash.toString("hex"),
            passwordSalt
        });

        if(!cliente) throw new ConflictError("Ya existe una cuenta con ese email.", "mail");

        return this.#createSession(cliente);
    }

    async login(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const mail = typeof data.mail === "string" ? data.mail.trim().toLowerCase() : "";
        const password = data.password;
        const cliente = await clienteRepository.findByMail(mail);

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

    async getUser(userId){
        const cliente = await clienteRepository.findById(userId);
        if(!cliente) throw new UnauthorizedError("La sesión no es válida o expiró.");
        return cliente;
    }

    async addBalance(userId, data) {
        if (!data || typeof data !== "object" || Array.isArray(data)) {
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const { amount } = data;
        if (
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            amount > 9999999999.99 ||
            Number(amount.toFixed(2)) !== amount
        ) {
            throw new BadRequestError(
                "Ingresa un importe positivo con un máximo de dos decimales.",
                "amount"
            );
        }

        const cliente = await clienteRepository.addBalance(userId, amount);
        if (cliente) return cliente;

        if (!await clienteRepository.findById(userId)) {
            throw new UnauthorizedError("La sesión no es válida o expiró.");
        }

        throw new BadRequestError(
            "El importe supera el saldo máximo permitido.",
            "amount"
        );
    }

    #createSession(cliente){
        return {
            token: createAuthToken(cliente.id),
            user: cliente
        };
    }
}

export default new AuthService();