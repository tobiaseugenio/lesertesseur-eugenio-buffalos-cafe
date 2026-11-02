import alimentoRepository from "../repositories/AlimentoRepository.js";
import { BadRequestError, NotFoundError } from "../exceptions/AppError.js";

class AlimentoService {
    getAll(){
        return alimentoRepository.findAll();
    }

    create(data){
        this.#validar(data);
        return alimentoRepository.create(data);
    }

    update(id, data){
        if(!/^[1-9]\d*$/.test(id)){
            throw new BadRequestError("El id debe ser un entero positivo.");
        }

        if(!alimentoRepository.findById(Number(id))){
            throw new NotFoundError("No se encontró un producto con ese id.");
        }

        this.#validar(data);
        return alimentoRepository.updateById(Number(id), data);
    }

    delete(id){
        if(!/^[1-9]\d*$/.test(id)){
            throw new BadRequestError("El id debe ser un entero positivo.");
        }

        const alimento = alimentoRepository.deleteById(Number(id));

        if(!alimento){
            throw new NotFoundError("No se encontró un producto con ese id.");
        }

        return alimento;
    }

    #validar(data){
        if(!data || typeof data !== "object" || Array.isArray(data)){
            throw new BadRequestError("El cuerpo de la solicitud debe ser un objeto JSON.");
        }

        const { nombre, precioUnitario, stock, imagen, esProductoEstrella } = data;

        if(esProductoEstrella !== undefined && typeof esProductoEstrella !== "boolean"){
            throw new BadRequestError("esProductoEstrella debe ser un valor booleano.");
        }

        if(typeof nombre !== "string" || !nombre.trim()){
            throw new BadRequestError("El nombre es obligatorio y debe ser texto.");
        }

        if(typeof precioUnitario !== "number" || !Number.isFinite(precioUnitario) || precioUnitario < 0){
            throw new BadRequestError("El precioUnitario es obligatorio y debe ser un número mayor o igual a cero.");
        }

        if(!Number.isInteger(stock) || stock < 0){
            throw new BadRequestError("El stock es obligatorio y debe ser un entero mayor o igual a cero.");
        }

        if(typeof imagen !== "string" || !imagen.trim()){
            throw new BadRequestError("La imagen es obligatoria y debe ser una URL válida.");
        }

        let imageUrl;
        try{
            imageUrl = new URL(imagen);
        }catch{
            throw new BadRequestError("La imagen debe ser una URL válida.");
        }

        if(!["http:", "https:"].includes(imageUrl.protocol) || !imageUrl.hostname){
            throw new BadRequestError("La imagen debe ser una URL HTTP o HTTPS válida.");
        }
    }
}

export default new AlimentoService();
