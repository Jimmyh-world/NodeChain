# 🔗 NodeChain - Simple Blockchain REST API

A minimal Node.js blockchain implementation with Express REST API, built following TDD principles and featuring proof-of-work consensus with file-based persistence.

## ✨ Features

- **Complete Blockchain Implementation**: Blocks with transactions, proof-of-work mining, chain validation
- **RESTful API**: Express.js endpoints for creating, retrieving, and managing blockchain data
- **File Persistence**: Blockchain data survives server restarts via JSON file storage
- **Proof-of-Work**: SHA-256 mining with configurable difficulty (4 leading zeros)
- **Simple Transactions**: Support for sender, receiver, and amount
- **Index-Based Retrieval**: Get blocks by index (0, 1, 2...)
- **TDD Approach**: 17 comprehensive tests covering all core functionality
- **ES6 Modules**: Modern JavaScript throughout
- **MVC Pattern**: Clean separation of models, controllers, routes
- **Basic Error Handling**: Centralized error middleware with structured responses
- **Simple Logging**: Console-based logging with timestamps

## 🚀 Quick Start

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Jimmyh-world/NodeChain.git
cd NodeChain

# Install dependencies
npm install

# Run tests
npm test

# Start the server
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### GET /blocks

Retrieve all blocks in the blockchain

```bash
curl http://localhost:3000/blocks
```

### POST /blocks

Create a new block with transaction data

```bash
curl -X POST http://localhost:3000/blocks \
  -H "Content-Type: application/json" \
  -d '{"sender": "Alice", "receiver": "Bob", "amount": 50}'
```

### GET /blocks/:id

Retrieve a specific block by index

```bash
curl http://localhost:3000/blocks/1
```

## 🏗 Project Structure

```
/controllers     → API logic (blockController.js)
/models         → Data models (Block, Blockchain)
/routes         → Express routes (blockRoutes.js)
/utils          → Logger, error handler, file manager
/tests          → Unit tests (Vitest)
/app.js         → Main Express app
/blockchain.json → Persistent blockchain data file
```

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:

- Block creation and proof-of-work mining
- Blockchain validation and chain integrity
- Transaction data storage and retrieval
- File persistence and loading
- API endpoint functionality

## 🔧 Technical Details

### Block Structure

```javascript
{
  index: 0,
  timestamp: "2024-01-01T00:00:00.000Z",
  data: {
    sender: "Alice",
    receiver: "Bob",
    amount: 50
  },
  previousHash: "0000...",
  hash: "0000...",
  nonce: 12345
}
```

### Proof-of-Work

- SHA-256 hashing algorithm
- Difficulty: 4 (requires 4 leading zeros)
- Nonce incrementation until valid hash found

### File Persistence

- Automatic save after each new block
- Load existing blockchain on server restart
- JSON format for human readability

## 📝 Assignment Compliance

✅ **Basic Requirements (Pass Grade)**

- Node.js blockchain application with REST API
- POST /blocks, GET /blocks, GET /blocks/:id endpoints
- MVC design pattern implementation
- Error handling with try-catch and HTTP status codes
- JSON file persistence (blockchain.json)
- ES6 modules throughout
- TDD with comprehensive test coverage
- Proof-of-work block validation

✅ **Advanced Requirements (VG Grade)**

- Complex transaction objects (sender, receiver, amount)
- Centralized error handling middleware
- Centralized logging system
- Clean, maintainable code structure

## 🎯 Key Design Decisions

- **Simplicity First**: Minimal complexity while meeting all requirements
- **Index-Only Retrieval**: Simplified API using numeric block indices
- **Console Logging**: Basic logging without file complexity
- **Essential Error Handling**: Structured responses without over-engineering
- **Core Functionality Focus**: All assignment requirements met without extras

## 🚀 Development

```bash
# Start the server
npm start

# Start development server with auto-restart
npm run dev

# Run tests
npm test
```

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**James Barclay**

---

_This project demonstrates a complete blockchain implementation following KISS & DRY principles while meeting all assignment requirements._
