class Client {
    validateName(name) {
        return name && name.trim() !== ''
    }

    static createClient(firstName, lastName) {
        const client = new Client()
        client.create(firstName, lastName)
        return client
    }

    create(firstName, lastName) {
        let error
        if (!this.validateName(firstName)) {
            error = 'Invalid first name'
        }

        if (!this.validateName(lastName)) {
            if (error) {
                error += ' and last name'
            }
            else {
                error = 'Invalid last name'
            }
        }

        if (error) {
            throw new Error(error)
        }
    
        this.firstName = firstName
        this.lastName = lastName
    }
}

export default Client;