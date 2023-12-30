import { describe, it } from 'node:test'
import assert from 'node:assert'

import CreateClient from './create.js'
import InMemoryClientRepository from '../../../adapters/repositories/inMemoryClientRepository.js'

describe('Create Client', () => {
    it('should create a new client', async () => {
        //Arrange
        const inMemoryClientRepository = new InMemoryClientRepository()
        const createClient = new CreateClient(inMemoryClientRepository)

        //Act
        await createClient.execute({
            firstName: 'John',
            lastName: 'Doe',
        })

        // Assert
        const clients = await inMemoryClientRepository.getClients();
        assert.strictEqual(clients.length, 1);
    })

    it('should create a namesake client', async () => {
        //Arrange
        const inMemoryClientRepository = new InMemoryClientRepository()
        const createClient = new CreateClient(inMemoryClientRepository)

        await createClient.execute({
            firstName: 'John',
            lastName: 'Doe',
        })

        //Act
        await createClient.execute({
            firstName: 'John',
            lastName: 'Doe',
        })

        // Assert
        const clients = await inMemoryClientRepository.getClients();

        assert.strictEqual(clients.length, 2);
        assert.deepStrictEqual(clients, [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
            },
            {
                id: 2,
                firstName: 'John',
                lastName: 'Doe',
            },
        ]);
    })

    const testCases = [
        {
            case: 'empty last name',
            payload: {
                firstName: 'John',
                lastName: '',
            },
            expected: "Invalid last name",
        },
        {
            case: 'empty first name',
            payload: {
                firstName: '',
                lastName: 'Doe',
            },
            expected: "Invalid first name",
        },
        {
            case: 'empty first and last name',
            payload: {
                firstName: '',
                lastName: '',
            },
            expected: "Invalid first name and last name",
        },
        {
            case: 'missing last name',
            payload: {
                firstName: 'John',
            },
            expected: "Invalid last name",
        },
    ]

    for (const testCase of testCases) {
        it(`when the client have ${testCase.case}, should return an error ${testCase.expected}`, async () => {
            //Arrange
            const inMemoryClientRepository = new InMemoryClientRepository()
            const createClient = new CreateClient(inMemoryClientRepository)

            //Act
            try {
                await createClient.execute(testCase.payload)
            } catch (error) {
                // Assert
                assert.strictEqual(error.message, testCase.expected)
            }
        })
    }
})