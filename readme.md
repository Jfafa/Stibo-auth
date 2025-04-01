# Authentication API

A RESTful authentication service built with Express.js and TypeScript using JWT for secure authentication.

## Features
- User registration and authentication
- JWT-based authentication (no cookies required)
- Password hashing with bcrypt
- MongoDB integration
- TypeScript for type safety
- RESTful API design

## Technology Stack
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Security:** bcrypt

## Quickstart

### Prerequisites
- Node.js (v14 or later)
- MongoDB instance (local or remote)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone <repository_url>
   cd <repository_name>
   ```

2. **Install dependencies:**
   ```sh
   npm install  
   # or
   yarn install
   ```

3. **Create a `.env` file** in the root directory with the following variables:
   ```env
   JWT_SECRET=<your_secret_key>
   JWT_EXPIRES_IN=7d
   MONGO_URI=<your_mongodb_connection_string>
   ```

4. **Build the application:**
   ```sh
   npm run build
   ```

5. **Start the server:**
   ```sh
   npm start
   ```

6. **For development with hot-reloading:**
   ```sh
   npm run dev
   ```

---

## API Endpoints

### Authentication

#### Register a New User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "exampleUser",
    "email": "user@example.com",
    "password": "securePassword"
  }
  ```
- **Success Response:**
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "userId",
      "username": "exampleUser",
      "email": "user@example.com"
    }
  }
  ```

#### Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "exampleUser",
    "password": "securePassword"
  }
  ```
  **Note:** You can use either `username` or `email` in the `username` field.
- **Success Response:**
  ```json
  {
    "token": "your.jwt.token"
  }
  ```

#### Get Current User
- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Headers:**
  ```sh
  Authorization: Bearer <your_jwt_token>
  ```
- **Success Response:**
  ```json
  {
    "id": "userId",
    "username": "exampleUser",
    "email": "user@example.com"
  }
  ```

---

## How It Works

### Authentication Flow
1. **Registration:** Users register by providing a username, email, and password. The password is hashed using bcrypt before being stored in the database.
2. **Login:** Users authenticate by providing their username/email and password. The system verifies credentials and returns a JWT token.
3. **Authorization:** For protected routes, clients must include the JWT token in the `Authorization` header (Bearer token). The middleware verifies the token and grants access if valid.

### Token Handling
- The JWT token contains user information (`id`, `username`, `email`).
- Tokens expire according to the `JWT_EXPIRES_IN` environment variable (default: **7 days**).
- Clients should store the token securely (e.g., in `localStorage` or a secure HTTP-only cookie if using a browser).

---

## Project Structure
```
├── src
│   ├── controllers  # Route controllers
│   ├── middleware   # Authentication middleware
│   ├── models       # MongoDB models
│   ├── routes       # API route definitions
│   ├── services     # Business logic services
│   ├── utils        # Utility functions
│   ├── index.ts     # Application entry point
├── .env             # Environment variables
├── package.json     # Dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── README.md        # Project documentation
```

---

## Security Notes
- JWT tokens are **signed with a secret key** and have an expiration time.
- Passwords are **hashed using bcrypt** before being stored.
- **Never store JWT tokens in client-side code** or commit them to version control.
- **In production, use HTTPS** to prevent token interception.

---

## Development

- **Development mode with hot reload:**
  ```sh
  npm run dev
  ```
- **Build for production:**
  ```sh
  npm run build
  ```
- **Start production server:**
  ```sh
  npm start
  ```

