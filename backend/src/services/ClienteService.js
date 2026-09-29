import clienteRepository from "../repositories/ClienteRepository.js";
import { NotFoundError, BadRequestError } from "../exceptions/AppError.js";
import { Messages } from "../enums/Messages.js";

class ClienteService {
    getAll(){
        return clienteRepository.findAll();
    }

    getById(id){
        const cliente = clienteRepository.findById(id);
        if(!cliente){
            throw new NotFoundError(Messages.CLIENTE_NOT_FOUND);
        }
        return cliente;
    }

    create(data){
        this.#validar(data);
        return clienteRepository.create(data);
    }

    update(id, data){
        this.getById(id);
        this.#validar(data, true);
        return clienteRepository.update(id, data);
    }

    delete(id){
        this.getById(id);
        clienteRepository.delete(id);
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
