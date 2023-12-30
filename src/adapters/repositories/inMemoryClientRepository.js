import ClientRepository from '../../core/ports/clientRepository.js'

class InMemoryClientRepository extends ClientRepository {
    id = 1

    constructor() {
        super()
        this.clients = [];
    }

    async save(client) {
        this.clients.push({
            id: this.id,
            ...client
        })

        this.id++
    }

    async getClients() {
        return this.clients
    }
}

export default InMemoryClientRepository;