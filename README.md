# Warez site based on MEAN Stack

A full-stack web application built with MongoDB, Express, Angular, and Node.js.

## Overview in hungarian (because it is a school project)

Warez oldal
Szerepkörök: admin, feltöltő és felhasználó.
Az admin kezeli az oldal struktúráját, hozhat létre és módosíthat kategóriákat (pl.: szoftver, játékok, filmek, zene), felügyelheti a feltöltéseket, és képes moderálni a felhasználók által hozzászólásokat. Az admin jogosultsággal rendelkezik felhasználói fiókok eltávolítására és az oldal biztonsági beállításainak kezelésére is.
A feltöltő szerepkörbe tartozó felhasználók hozzáférhetnek a feltöltési szekcióhoz, ahol megoszthatnak tartalmakat a weboldalon belül. Minden feltöltéshez meg kell adniuk a tartalom címét, leírását, és kategorizálniuk kell azt.
A felhasználók böngészhetnek a különböző kategóriák között, letölthetik a kívánt tartalmakat, és hozzászólásokat írhatnak az egyes tartalmakhoz. A felhasználóknak lehetőségük van értékelni a tartalmakat, így segítve másokat a minőségi tartalmak kiválasztásában.

https://docs.google.com/document/d/1PDY0jedRbfdsNSUEc4WcMX4SsJa1M2o7niCWyoTGQ7U/edit?tab=t.0

## Features

- **Single Page Application**: Fast, dynamic user interface built with Angular
- **RESTful API**: Express backend providing structured data endpoints
- **NoSQL Database**: Flexible MongoDB data storage
- **Authentication**: JWT-based user authentication system
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **MongoDB**: Document database for storing application data
- **Express.js**: Node.js framework for building the API
- **Angular**: Frontend framework for building dynamic web applications
- **Node.js**: JavaScript runtime for the backend server

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB
- Angular CLI

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/hasYm8/mean-warez.git
   cd mean
   ```

2. Install api dependencies
   ```bash
   cd api
   npm install
   ```

3. Install client dependencies
   ```bash
   cd client
   npm install
   ```

4. Configure environment variables
   - Configure `.env` file
   - Add the following variables: TODO
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/mean-app
     JWT_SECRET=your_jwt_secret
     ```

5. Start development servers
   ```bash
   # Start Docker containers
   cd docker
   docker compose --env-file .env -p warez up -d

   # Start api server
   cd api
   npm run start

   # Start client server
   cd client
   npm run start
   ```

6. Visit `http://localhost:4200` in your browser

## Development

### API Endpoints TODO

The API is available at `http://localhost:3000/api/`

few example:
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires authentication)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Angular documentation
- Express.js documentation
- MongoDB documentation
- Node.js documentation