# NodeChain - Simple Blockchain REST API

A simple Node.js blockchain REST API built for educational purposes as part of a full-stack development course assignment. This project demonstrates fundamental blockchain concepts including proof-of-work, block creation, and persistence through a clean REST API.

## 🎯 Project Purpose

This is a **school assignment** that implements a basic blockchain system with the following goals:

- Learn Node.js API development with Express
- Understand proof-of-work consensus mechanisms
- Practice test-driven development (TDD) with Vitest
- Implement proper error handling and logging
- Follow MVC design patterns and ES6 modules

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

```bash
# Start the server
npm start

# Start with auto-reload for development
npm run dev

# Run tests
npm test
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
/
├── controllers/     # API request handlers and business logic
├── models/         # Data models (Block, Blockchain classes)
├── routes/         # Express route definitions
├── utils/          # Utilities (logger, error handlers)
├── logs/           # Application and error log files
├── tests/          # Unit tests (Vitest)
├── app.js          # Main Express application entry point
├── blockchain.json # Persistent blockchain data storage
└── package.json    # Project configuration and dependencies
```

## 🔧 API Endpoints

- `POST /blocks` - Create a new block with proof-of-work mining
- `GET /blocks` - Retrieve all blocks in the blockchain
- `GET /blocks/:id` - Retrieve a specific block by index or hash

## 🛠 Technical Features

- **ES6 Modules**: Modern JavaScript module system
- **Proof-of-Work**: Basic mining algorithm for block validation
- **File Persistence**: Blockchain data saved to JSON file
- **Centralized Logging**: Structured logging to physical files
- **Error Handling**: Comprehensive error management with proper HTTP status codes
- **Test-Driven Development**: Unit tests with Vitest
- **MVC Architecture**: Clean separation of concerns

## 🧪 Testing

This project follows test-driven development (TDD) principles. Run tests with:

```bash
npm test
```

Tests focus on:

- Block creation and validation
- Blockchain operations
- API endpoint functionality
- Proof-of-work algorithm

## 📝 Development Notes

- The project emphasizes simplicity and educational value over production features
- Code is well-documented with JSDoc comments for learning purposes
- Follows KISS (Keep It Simple, Stupid) principles
- All components are designed to be human-readable and maintainable

## 🎓 Assignment Context

This project fulfills the requirements for a Node.js blockchain assignment including:

- REST API implementation
- Blockchain data structures
- Proof-of-work mining
- Persistent storage
- Comprehensive testing
- Professional code quality and documentation

---

_Built with Node.js, Express, and Vitest for educational purposes._
