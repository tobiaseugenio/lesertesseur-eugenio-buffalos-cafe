class ClienteResponse {
    constructor(cliente){
        this.id = cliente.id;
        this.nombre = cliente.nombre;
        this.mail = cliente.mail;
        this.saldo = cliente.saldo;
    }

    static fromCliente(cliente){
        return new ClienteResponse(cliente);
    }

    static fromClientes(clientes){
        return clientes.map(ClienteResponse.fromCliente);
    }
}

export default ClienteResponse;
