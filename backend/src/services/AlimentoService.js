import alimentoRepository from "../repositories/AlimentoRepository.js";
import { BadRequestError } from "../exceptions/AppError.js";

class AlimentoService {
    getAll(){
        return alimentoRepository.findAll();
    }

    create(data){
        this.#validar(data);
        return alimentoRepository.create(data);
    }

    #validar(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const { nombre, precioUnitario, stock, imagen } = data;

        if(typeof nombre !== "string" || !nombre.trim()){
            throw new BadRequestError("El nombre es obligatorio y debe ser texto.");
        }

        if(typeof precioUnitario !== "number" || !Number.isFinite(precioUnitario) || precioUnitario < 0){
            throw new BadRequestError("El precioUnitario es obligatorio y debe ser un número mayor o igual a cero.");
        }

        if(!Number.isInteger(stock) || stock < 0){
            throw new BadRequestError("El stock es obligatorio y debe ser un entero mayor o igual a cero.");
        }

        if(imagen !== undefined && typeof imagen !== "string"){
            throw new BadRequestError("La imagen debe ser una URL en formato de texto.");
        }
    }
}

export default new AlimentoService();
