class Cliente{
    constructor(id, nombre, mail, saldo = 0, passwordHash = null, passwordSalt = null){
        this.id = id
        this.nombre = nombre
        this.mail = mail
        this.saldo = saldo
        this.passwordHash = passwordHash
        this.passwordSalt = passwordSalt
    }
}
export default Cliente;