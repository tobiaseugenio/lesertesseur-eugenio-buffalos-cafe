class AlimentoRepository {
    #alimentos = [];

    findAll(){
        return this.#alimentos;
    }
}

export default new AlimentoRepository();
