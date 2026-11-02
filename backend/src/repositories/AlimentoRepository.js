import Alimento from "../models/Alimento.js";

class AlimentoRepository {
    #alimentos = [];
    #nextId = 1;

    findAll(){
        return this.#alimentos;
    }

    create({ nombre, precioUnitario, stock, imagen }){
        const alimento = new Alimento(
            this.#nextId++,
            nombre,
            precioUnitario,
            stock,
            imagen
        );
        this.#alimentos.push(alimento);
        return alimento;
    }

    findById(id){
        return this.#alimentos.find((alimento) => alimento.id === id);
    }

    updateById(id, { nombre, precioUnitario, stock, imagen }){
        const alimento = this.findById(id);
        if(!alimento) return null;

        alimento.nombre = nombre;
        alimento.precioUnitario = precioUnitario;
        alimento.stock = stock;
        alimento.imagen = imagen;

        return alimento;
    }

    deleteById(id){
        const index = this.#alimentos.findIndex((alimento) => alimento.id === id);

        if(index === -1){
            return null;
        }

        return this.#alimentos.splice(index, 1)[0];
    }
}

export default new AlimentoRepository();
