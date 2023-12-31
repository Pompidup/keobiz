# Keobiz

Keobiz is a project that manages clients and their balance sheets. It uses a combination of in-memory and SQL repositories to store data.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software and how to install them:

- Node.js
- Docker

### Installing

A step by step series of examples that tell you how to get a development environment running:

1. Clone the repository

```bash
git clone https://github.com/username/keobiz.git
```

2. Navigate to the project directory

```bash
cd keobiz
```

3. Install dependencies

```bash
npm install
```

4. Setup env variable

```bash
cp .env.default .env
```

And then edit the `.env` file to match your environment.

## Running the tests

```bash
npm run test
```

You can also run the tests with coverage report:

```bash
npm run test:coverage
```

## Running the application

Run the application in development mode:

```bash
npm run dev
```

Run the application in production mode:

```bash
make start
```

(this will build the docker image and run the container then run the application)

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [Node.js](https://nodejs.org/) - The runtime environment
- [MySQL](https://www.mysql.com/) - The database used
