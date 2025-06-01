import crypto from 'crypto';

/**
 * Represents a single block in the blockchain
 * Each block contains transaction data and is linked to the previous block via hash
 * Uses proof-of-work consensus mechanism to ensure block validity
 */
export class Block {
  /**
   * Creates a new block and automatically mines it using proof-of-work
   * @param {number} index - Position of the block in the blockchain
   * @param {Object} data - Transaction data (sender, receiver, amount, metadata)
   * @param {string} previousHash - Hash of the previous block in the chain
   * @param {number} difficulty - Number of leading zeros required in hash (mining difficulty)
   */
  constructor(index, data, previousHash, difficulty = 4) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty;

    // Automatically mine the block when created
    this.hash = this.mineBlock();
  }

  /**
   * Calculates SHA-256 hash of the block's contents
   * Combines all block properties into a single hash for integrity verification
   * @returns {string} SHA-256 hash as hexadecimal string
   */
  calculateHash() {
    // Create a string representation of the block's data for hashing
    const blockString =
      this.index +
      this.timestamp.toISOString() +
      JSON.stringify(this.data) +
      this.previousHash +
      this.nonce;

    // Generate SHA-256 hash
    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  /**
   * Performs proof-of-work mining to find a valid hash
   * Increments nonce until hash starts with required number of zeros
   * This computational work secures the blockchain against tampering
   * @returns {string} Valid hash that meets the difficulty requirement
   */
  mineBlock() {
    // Create target string of leading zeros based on difficulty
    const target = Array(this.difficulty + 1).join('0');

    // Keep trying different nonce values until we find a valid hash
    while (true) {
      const hash = this.calculateHash();

      // Check if hash meets difficulty requirement (starts with enough zeros)
      if (hash.substring(0, this.difficulty) === target) {
        // Found valid hash! Mining complete
        console.log(`Block mined: ${hash} (nonce: ${this.nonce})`);
        return hash;
      }

      // Hash doesn't meet requirement, increment nonce and try again
      this.nonce++;
    }
  }
}
