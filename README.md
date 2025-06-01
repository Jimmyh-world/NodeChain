# 🔗 NodeChain - Simple Blockchain REST API

A complete Node.js blockchain implementation with Express REST API, built following TDD principles and featuring proof-of-work consensus with file-based persistence.

## ✨ Features

- **Complete Blockchain Implementation**: Blocks with transactions, proof-of-work mining, chain validation
- **RESTful API**: Express.js endpoints for creating, retrieving, and managing blockchain data
- **File Persistence**: Blockchain data survives server restarts via JSON file storage
- **Proof-of-Work**: SHA-256 mining with configurable difficulty (4 leading zeros)
- **Complex Transactions**: Support for sender, receiver, amount, and custom metadata
- **Smart Retrieval**: Get blocks by index (numeric) or hash (string) via single endpoint
- **TDD Approach**: 28 comprehensive tests covering all functionality
- **Centralized Logging**: Structured logging system for operations and errors
- **Error Handling**: Robust error handling with meaningful HTTP status codes
- **ES6 Modules**: Modern JavaScript throughout

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run tests
npm test

# Start server
npm start

# Server runs on http://localhost:3000
```

## 📡 API Endpoints

### Health Check

```bash
GET /
# Returns API documentation and endpoints
```

### Blockchain Operations

```bash
# Get all blocks
GET /blocks

# Create new block
POST /blocks
Content-Type: application/json
{
  "sender": "Alice",
  "receiver": "Bob",
  "amount": 100,
  "metadata": {
    "note": "Payment for services"
  }
}

# Get specific block by index or hash
GET /blocks/:id
# Examples:
# GET /blocks/1 (by index)
# GET /blocks/000014a506459a5... (by hash)

# Get blockchain statistics
GET /blocks/stats
```

## 🔧 Project Structure

```
/controllers     → API business logic
/models         → Block and Blockchain classes
/routes         → Express route definitions
/utils          → Logger, error handler, file manager
/tests          → Comprehensive test suite (28 tests)
/logs           → Server and error logs
app.js          → Main Express server
blockchain.json → Persistent blockchain data
```

## 🧪 Testing Results

All **28 tests passing** with comprehensive coverage:

- **Block Tests (10)**: Creation, validation, proof-of-work, complex data
- **Blockchain Tests (18)**: Chain management, validation, retrieval, edge cases

```bash
Test Files  2 passed (2)
Tests      28 passed (28)
Duration   ~12s
```

## 💾 File Persistence

The blockchain automatically persists to `blockchain.json`:

- **Auto-Save**: New blocks trigger automatic file save
- **Auto-Load**: Server startup loads existing blockchain data
- **Error Recovery**: Graceful handling of corrupted files with fallback
- **Validation**: Loaded data undergoes full chain validation

### Persistence Features

- JSON serialization of complete blockchain state
- Block reconstruction with proper class methods
- Metadata tracking (save timestamp, block count, validity)
- Backup functionality for data safety

## 🔐 Security & Validation

- **Chain Integrity**: Full blockchain validation on load
- **Hash Verification**: SHA-256 hash validation for all blocks
- **Link Verification**: Previous hash chain validation
- **Input Validation**: Comprehensive request validation
- **Error Boundaries**: Centralized error handling

## 📊 Example API Usage

### Creating and Retrieving Blocks

```bash
# Create a new transaction block
curl -X POST http://localhost:3000/blocks \
  -H "Content-Type: application/json" \
  -d '{
    "sender": "Alice",
    "receiver": "Bob",
    "amount": 50,
    "metadata": {"note": "Coffee payment"}
  }'

# Response includes mined block with proof-of-work
{
  "success": true,
  "message": "Block created and mined successfully",
  "data": {
    "block": {
      "index": 1,
      "hash": "000014a506459a5...",
      "nonce": 20694,
      "data": { /* transaction data */ }
    },
    "chainLength": 2,
    "difficulty": 4,
    "persisted": true
  }
}

# Retrieve block by index
curl http://localhost:3000/blocks/1

# Retrieve block by hash
curl http://localhost:3000/blocks/000014a506459a5...

# Get blockchain statistics
curl http://localhost:3000/blocks/stats
```

## 🏗 Architecture Highlights

### MVC Pattern

- **Models**: Block and Blockchain classes with business logic
- **Controllers**: API request handling and validation
- **Routes**: Clean endpoint definitions

### Proof-of-Work Mining

- SHA-256 hashing algorithm
- Configurable difficulty (4 leading zeros)
- Nonce incrementation until valid hash found
- Mining performance logging

### File System Integration

- Node.js `fs/promises` for async file operations
- JSON serialization with proper Date handling
- Graceful error handling for I/O operations
- Automatic backup functionality

## 🎯 Assignment Compliance

✅ **Pass Requirements Met**:

- REST API endpoints for blockchain operations
- MVC design pattern implementation
- ES6 modules throughout
- JSON file persistence
- Error handling best practices
- TDD development approach
- Proof-of-work validation

✅ **VG Requirements Met**:

- Complex transaction objects with metadata
- Centralized error handling middleware
- Centralized logging system
- High-quality, maintainable code

## 🔍 Testing the Persistence

To verify blockchain data survives server restarts:

1. Start server: `npm start`
2. Create blocks via POST requests
3. Stop server: `Ctrl+C`
4. Restart server: `npm start`
5. Verify blocks still exist: `GET /blocks/stats`

The blockchain.json file contains the complete chain state and will be automatically loaded on server startup.

## 🛠 Development

Built with modern development practices:

- Test-driven development (TDD)
- Comprehensive logging and monitoring
- Error boundary patterns
- Clean code principles
- Security-first approach

---

**NodeChain** - A complete blockchain API implementation showcasing modern Node.js development practices with robust testing, persistence, and real-world production considerations.
