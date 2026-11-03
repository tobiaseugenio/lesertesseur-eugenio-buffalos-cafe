import clienteRepository from "../repositories/ClienteRepository.js";
import { NotFoundError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class ClienteService {
    async getAll(){
        return clienteRepository.findAll();
    }

    async getById(id){
        const cliente = await clienteRepository.findById(id);
        if(!cliente){
            throw new NotFoundError(Messages.CLIENTE_NOT_FOUND);
        }
        return cliente;
    }

    async create(data){
        this.#validar(data);
        return clienteRepository.create(data);
    }

    async update(id, data){
        await this.getById(id);
        this.#validar(data, true);
        return clienteRepository.update(id, data);
    }

    async delete(id){
        await this.getById(id);
        await clienteRepository.delete(id);
    }

    #validar({ nombre, mail, saldo }, esParcial = false){
        if(!esParcial || nombre !== undefined){
            if(!nombre || typeof nombre !== "string"){
                throw new BadRequestError(Messages.NOMBRE_REQUIRED);
            }
        }

        if(!esParcial || mail !== undefined){
            if(!mail || typeof mail !== "string"){
                throw new BadRequestError(Messages.MAIL_REQUIRED);
            }
        }

        if(!esParcial || saldo !== undefined){
            if(saldo === undefined || typeof saldo !== "number"){
                throw new BadRequestError(Messages.SALDO_REQUIRED);
            }
        }
    }
}

export default new ClienteService();
