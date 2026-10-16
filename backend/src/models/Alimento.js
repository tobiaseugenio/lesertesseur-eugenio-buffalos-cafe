class Alimento{
    constructor(id, nombre, precioUnitario, stock, imagen){
        this.id = id;
        this.nombre = nombre
        this.precioUnitario = precioUnitario
        this.stock = stock
        if(imagen !== undefined) this.imagen = imagen;
    }
}
export default Alimento;