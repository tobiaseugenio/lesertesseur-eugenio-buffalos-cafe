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
}

export default new AlimentoRepository();
