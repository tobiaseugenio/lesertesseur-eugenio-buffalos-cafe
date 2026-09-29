import Cliente from "../models/Cliente.js";

class ClienteRepository {
    #clientes = [];
    #nextId = 1;

    findAll(){
        return this.#clientes;
    }

    findById(id){
        return this.#clientes.find(cliente => cliente.id === Number(id));
    }

    create({ nombre, mail, saldo }){
        const cliente = new Cliente(this.#nextId++, nombre, mail, saldo);
        this.#clientes.push(cliente);
        return cliente;
    }

    update(id, { nombre, mail, saldo }){
        const cliente = this.findById(id);
        if(!cliente) return null;

        if(nombre !== undefined) cliente.nombre = nombre;
        if(mail !== undefined) cliente.mail = mail;
        if(saldo !== undefined) cliente.saldo = saldo;

        return cliente;
    }

    delete(id){
        const index = this.#clientes.findIndex(cliente => cliente.id === Number(id));
        if(index === -1) return false;

        this.#clientes.splice(index, 1);
        return true;
    }
}

export default new ClienteRepository();
