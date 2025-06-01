import { Block } from './block.js';

/**
 * Represents a complete blockchain with genesis block and chain management
 * Handles block addition, validation, and retrieval operations
 * Uses proof-of-work consensus for block validation
 */
export class Blockchain {
  /**
   * Creates a new blockchain and initializes it with a genesis block
   * @param {number} difficulty - Mining difficulty (number of leading zeros required)
   */
  constructor(difficulty = 4) {
    this.chain = [];
    this.difficulty = difficulty;

    // Create and add the genesis block to start the chain
    this.createGenesisBlock();
  }

  /**
   * Creates the initial genesis block for the blockchain
   * Genesis block is the first block with no previous hash reference
   * @private
   */
  createGenesisBlock() {
    const genesisData = {
      sender: 'Genesis',
      receiver: 'Genesis',
      amount: 0,
      metadata: {
        timestamp: new Date().toISOString(),
        transactionId: 'genesis_block',
      },
    };

    const genesisBlock = new Block(0, genesisData, '0', this.difficulty);
    this.chain.push(genesisBlock);
  }

  /**
   * Retrieves the most recently added block in the chain
   * @returns {Block} The latest block in the blockchain
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Adds a new block to the blockchain with the provided transaction data
   * New block is automatically linked to the previous block via hash
   * @param {Object} data - Transaction data to store in the new block
   */
  addBlock(data) {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock.index + 1;
    const previousHash = previousBlock.hash;

    // Create new block with proper linking and mine it
    const newBlock = new Block(newIndex, data, previousHash, this.difficulty);

    // Add the mined block to the chain
    this.chain.push(newBlock);
  }

  /**
   * Validates the entire blockchain for integrity and consistency
   * Checks hash validity and proper block linking throughout the chain
   * @returns {boolean} True if chain is valid, false if corrupted or tampered
   */
  isChainValid() {
    // Start from index 1 (skip genesis block as it has no previous block)
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check if current block's hash is still valid
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false; // Block has been tampered with
      }

      // Check if current block properly links to previous block
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false; // Chain link is broken
      }

      // Check if hash meets difficulty requirement
      const target = Array(this.difficulty + 1).join('0');
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        return false; // Hash doesn't meet proof-of-work requirement
      }
    }

    // If we reach here, all blocks are valid
    return true;
  }

  /**
   * Retrieves a block by its index position in the chain
   * @param {number} index - The position of the block in the chain
   * @returns {Block|null} The block at the specified index, or null if invalid
   */
  getBlockByIndex(index) {
    // Validate index is a number and within valid range
    if (typeof index !== 'number' || index < 0 || index >= this.chain.length) {
      return null;
    }

    return this.chain[index];
  }

  /**
   * Retrieves a block by its unique hash value
   * @param {string} hash - The hash of the block to find
   * @returns {Block|null} The block with the specified hash, or null if not found
   */
  getBlockByHash(hash) {
    // Validate hash parameter
    if (!hash || typeof hash !== 'string') {
      return null;
    }

    // Search through the chain for matching hash
    for (let i = 0; i < this.chain.length; i++) {
      if (this.chain[i].hash === hash) {
        return this.chain[i];
      }
    }

    // Hash not found in the chain
    return null;
  }

  /**
   * Returns the total number of blocks in the blockchain
   * @returns {number} The count of blocks including genesis block
   */
  getBlockCount() {
    return this.chain.length;
  }
}
