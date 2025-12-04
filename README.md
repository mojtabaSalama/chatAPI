# chatAPI
# ChatAPI - Real-time Chat Application

A robust real-time chat API built with Node.js, Express, WebSocket, and MySQL. This application provides a complete backend solution for chat functionality with user authentication, room management, and real-time messaging capabilities.

## Features

- **Real-time Messaging**: WebSocket-based instant messaging with low latency
- **User Authentication**: JWT-based secure user authentication with bcrypt password hashing
- **Chat Rooms**: Support for multiple chat rooms and private messaging
- **Message History**: Persistent storage of chat messages using MySQL
- **User Management**: Complete user registration, login, and profile management
- **Security**: XSS protection, CORS enabled, and input sanitization
- **File Upload**: Support for image and file uploads in chat
- **RESTful API**: Well-structured REST endpoints for all operations
- **WebSocket Communication**: Real-time bidirectional communication

## Libraries Used

### Core Dependencies

- **[Express.js](https://expressjs.com/)** (`^4.18.2`) - Fast, minimalist web framework for Node.js
- **[MySQL2](https://www.npmjs.com/package/mysql2)** (`^3.2.0`) - MySQL client for database operations
- **[Sequelize](https://sequelize.org/)** (`^6.30.0`) - Promise-based ORM for database management
- **[WebSocket (ws)](https://www.npmjs.com/package/ws)** (`^8.16.0`) - WebSocket implementation for real-time communication
- **[Socket.IO](https://socket.io/)** (`^4.7.1`) - Additional WebSocket support (alternative implementation)
- **[JSON Web Token](https://www.npmjs.com/package/jsonwebtoken)** (`^9.0.0`) - JWT for secure authentication
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** (`^2.4.3`) - Password hashing for security
- **[CORS](https://www.npmjs.com/package/cors)** (`^2.8.5`) - Cross-Origin Resource Sharing middleware
- **[Multer](https://www.npmjs.com/package/multer)** (`^1.4.5-lts.1`) - Middleware for handling file uploads
- **[xss-filters](https://www.npmjs.com/package/xss-filters)** (`^1.2.7`) - XSS protection filters
- **[dotenv](https://www.npmjs.com/package/dotenv)** (`^16.0.3`) - Environment variable management

### Development Dependencies

- **[Nodemon](https://nodemon.io/)** (`^3.0.1`) - Development server with auto-restart

## Project Structure
chatAPI/
├── controllers/          # Business logic controllers
│   ├── users/           # User-related operations
│   ├── rooms/           # Chat room operations
│   └── messages/        # Message handling logic
├── middlewares/         # Custom middleware functions
│   └── auth/            # Authentication middleware
├── models/              # Database models
├── routes/              # API route definitions
│   ├── users.js         # User routes
│   ├── rooms.js         # Room routes
│   └── messages.js      # Message routes
├── public/              # Static files and uploads
├── socketServer.js      # WebSocket server configuration
├── index.js             # Main application entry point
├── package.json         # Project dependencies
└── .env                 # Environment variables (create this)

## API Endpoints

### Authentication
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update` - Update user profile

### Rooms
- `GET /api/room` - Get all chat rooms
- `POST /api/room/create` - Create new chat room
- `GET /api/room/:id` - Get specific room details
- `POST /api/room/:id/join` - Join a chat room

### Messages
- `GET /api/message/:roomId` - Get messages for a room
- `POST /api/message/send` - Send a message
- `POST /api/message/upload` - Upload file/image
- `DELETE /api/message/:id` - Delete a message

### WebSocket Events
- `connection` - Establish WebSocket connection
- `message` - Send/receive real-time messages
- `join-room` - Join a chat room
- `leave-room` - Leave a chat room
- `typing` - Typing indicators

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MySQL](https://www.mysql.com/) database server
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mojtabaSalama/chatAPI.git
cd chatAPI

3. Install dependencies:

   npm install

### Running the Application

1. Start the server:

   node server.js

2. The application will run on [http://localhost:3000](http://localhost:3000) by default (or the port specified in the `server.js` file).
