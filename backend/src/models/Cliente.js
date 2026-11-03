class Cliente{
    constructor(id, nombre, mail, saldo = 0, passwordHash = null, passwordSalt = null, role = "user"){
        this.id = id
        this.nombre = nombre
        this.mail = mail
        this.saldo = saldo
        this.passwordHash = passwordHash
        this.passwordSalt = passwordSalt
        this.role = role
    }
}
export default Cliente;