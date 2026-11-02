class AlimentoResponse {
    constructor(alimento){
        this.id = alimento.id;
        this.nombre = alimento.nombre;
        this.precioUnitario = alimento.precioUnitario;
        this.stock = alimento.stock;
        this.imagen = alimento.imagen;
        this.esProductoEstrella = alimento.esProductoEstrella ?? false;
    }

    static fromAlimentos(alimentos){
        return alimentos.map(AlimentoResponse.fromAlimento);
    }

    static fromAlimento(alimento){
        return new AlimentoResponse(alimento);
    }
}

export default AlimentoResponse;
