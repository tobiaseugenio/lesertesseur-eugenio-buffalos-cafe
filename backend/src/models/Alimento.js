class Alimento{
    constructor(id, nombre, precioUnitario, stock, imagen, esProductoEstrella = false){
        this.id = id;
        this.nombre = nombre
        this.precioUnitario = precioUnitario
        this.stock = stock
        if(imagen !== undefined) this.imagen = imagen;
        this.esProductoEstrella = esProductoEstrella;
    }
}
export default Alimento;