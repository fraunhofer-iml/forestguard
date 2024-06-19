# ForestGuard

ForestGuard is a project aimed at tracking deforestation-free coffee using blockchain technology.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

ForestGuard ensures that the coffee you drink is sourced from deforestation-free regions. By leveraging blockchain technology, ForestGuard provides transparency and traceability in the coffee supply chain, ensuring that every step from the coffee farm to your cup is accountable and environmentally friendly.

## Architecture

The project consists of the following components:

### Backend Services

1. **API Gateway (`api`)**

   [![Quality Gate Status](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/api/project_badges/measure?project=ForestGuard-API&metric=alert_status&token=sqb_349dd965afbf44951ecd67d434c27372ad5ed048)](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/dashboard?id=ForestGuard-API)

   - Handles all incoming HTTP requests and routes them to the appropriate services via AMQP.
   - Exposes endpoints for the frontend application.

2. **Entity Management Service (`entity-management-svc`)**

   [![Quality Gate Status](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/api/project_badges/measure?project=ForestGuard-Entity-Management&metric=alert_status&token=sqb_6d3fe2239c42bf8431de04c97781eb7a5faf0060)](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/dashboard?id=ForestGuard-Entity-Management)

   - Manages all entities such as coffee farms, batches, and certifications.
   - Interacts with the database and blockchain to store and retrieve entity data.

3. **Process Service (`process-svc`)**

   [![Quality Gate Status](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/api/project_badges/measure?project=ForestGuard-Process-Service&metric=alert_status&token=sqb_e1efd21cbe4165686d1c4530bc1e14b6af9508f5)](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/dashboard?id=ForestGuard-Process-Service)

   - Handles background processes and workflows.
   - Manages the lifecycle of coffee batches, from production to delivery.

### Frontend

[![Quality Gate Status](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/api/project_badges/measure?project=ForestGuard-Frontend&metric=alert_status&token=sqb_65fd41222f9ca133b1a81b9fc90bee3ef6be553b)](https://sonar.apps.blockchain-europe.iml.fraunhofer.de/dashboard?id=ForestGuard-Frontend)

A web application that allows users to track coffee batches, view certifications, and verify the deforestation-free status of their coffee.

## Installation

### Prerequisites

- Node.js (v20 or later)
- Docker (for running the blockchain network and services)
- Postgres (v16 or later)
- RabbitMQ
- Minio

### Application

1. Clone the repository:

```bash
git clone https://gitlab.cc-asp.fraunhofer.de/oe260/forest-guard/core.git forest-guard
cd forest-guard
```

2. Install dependencies:

```bash
npm install
```

3. Start the dependent services via docker compose:

```bash
docker compose up
```

4. Set up database

```bash
npm run set-up-database
```

5. Run app in development mode

```bash
npm run dev
```

## Usage

Once all services are running, you can access the frontend application at http://localhost:4200. Use the application to track coffee batches, view certifications, and verify the deforestation-free status.

## Contributing

We welcome contributions from the community. To contribute, please fork the repository and create a pull request with your changes. Ensure that your code follows the project’s coding standards and includes appropriate tests.

## License

A license need to be selected and added
