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

    deleteById(id){
        const index = this.#alimentos.findIndex((alimento) => alimento.id === id);

        if(index === -1){
            return null;
        }

        return this.#alimentos.splice(index, 1)[0];
    }
}

export default new AlimentoRepository();
