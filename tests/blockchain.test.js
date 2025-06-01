import { describe, test, expect, beforeEach } from 'vitest';
import { Blockchain } from '../models/blockchain.js';
import { Block } from '../models/block.js';

/**
 * Test suite for Blockchain class
 * These tests define the contract and expected behavior for blockchain management
 * following TDD principles - tests first, implementation second
 */
describe('Blockchain', () => {
  let blockchain;

  /**
   * Test data representing various blockchain transactions
   * Using realistic but simple data structures for educational purposes
   */
  const mockTransactions = {
    transaction1: {
      sender: 'Alice',
      receiver: 'Bob',
      amount: 50,
      metadata: {
        timestamp: '2024-01-15T10:30:00Z',
        transactionId: 'tx_001',
      },
    },
    transaction2: {
      sender: 'Bob',
      receiver: 'Charlie',
      amount: 25,
      metadata: {
        timestamp: '2024-01-15T11:15:00Z',
        transactionId: 'tx_002',
      },
    },
    transaction3: {
      sender: 'Charlie',
      receiver: 'Diana',
      amount: 75,
      metadata: {
        timestamp: '2024-01-15T12:00:00Z',
        transactionId: 'tx_003',
      },
    },
  };

  beforeEach(() => {
    // Create fresh blockchain for each test to ensure isolation
    blockchain = new Blockchain();
  });

  describe('Genesis Block', () => {
    test('should initialize with a valid genesis block', () => {
      // Assert - Blockchain should start with exactly one block (genesis)
      expect(blockchain.chain).toBeDefined();
      expect(blockchain.chain.length).toBe(1);
      expect(blockchain.chain[0]).toBeInstanceOf(Block);
    });

    test('genesis block should have correct properties', () => {
      // Arrange & Act
      const genesisBlock = blockchain.chain[0];

      // Assert - Genesis block should have specific characteristics
      expect(genesisBlock.index).toBe(0);
      expect(genesisBlock.previousHash).toBe('0');
      expect(genesisBlock.data).toBeDefined();
      expect(genesisBlock.hash).toBeDefined();
      expect(genesisBlock.timestamp).toBeInstanceOf(Date);
    });

    test('should have a difficulty setting', () => {
      // Assert - Blockchain should have configurable mining difficulty
      expect(blockchain.difficulty).toBeDefined();
      expect(typeof blockchain.difficulty).toBe('number');
      expect(blockchain.difficulty).toBeGreaterThan(0);
    });
  });

  describe('Block Addition', () => {
    test('should be able to add a new block', () => {
      // Arrange
      const initialLength = blockchain.chain.length;

      // Act
      blockchain.addBlock(mockTransactions.transaction1);

      // Assert - Chain should grow by one block
      expect(blockchain.chain.length).toBe(initialLength + 1);
      expect(blockchain.chain[1]).toBeInstanceOf(Block);
    });

    test('new block should link correctly to previous block', () => {
      // Arrange & Act
      blockchain.addBlock(mockTransactions.transaction1);
      const newBlock = blockchain.getLatestBlock();
      const previousBlock = blockchain.chain[blockchain.chain.length - 2];

      // Assert - New block should reference previous block's hash
      expect(newBlock.previousHash).toBe(previousBlock.hash);
      expect(newBlock.index).toBe(previousBlock.index + 1);
    });

    test('should update chain length accordingly when adding multiple blocks', () => {
      // Arrange
      const initialLength = blockchain.chain.length;

      // Act
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);
      blockchain.addBlock(mockTransactions.transaction3);

      // Assert - Chain should contain all added blocks plus genesis
      expect(blockchain.chain.length).toBe(initialLength + 3);
      expect(blockchain.chain.length).toBe(4); // Genesis + 3 new blocks
    });

    test('should store transaction data correctly in new blocks', () => {
      // Arrange & Act
      blockchain.addBlock(mockTransactions.transaction2);
      const newBlock = blockchain.getLatestBlock();

      // Assert - Block should preserve transaction data exactly
      expect(newBlock.data).toEqual(mockTransactions.transaction2);
      expect(newBlock.data.sender).toBe('Bob');
      expect(newBlock.data.amount).toBe(25);
    });

    test('getLatestBlock should return the most recently added block', () => {
      // Arrange
      blockchain.addBlock(mockTransactions.transaction1);

      // Act
      const latestBlock = blockchain.getLatestBlock();

      // Assert - Should return the last block in the chain
      expect(latestBlock).toBe(blockchain.chain[blockchain.chain.length - 1]);
      expect(latestBlock.data).toEqual(mockTransactions.transaction1);
    });
  });

  describe('Chain Validation', () => {
    test('should validate a correct blockchain as valid', () => {
      // Arrange - Create a valid blockchain with multiple blocks
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      // Act & Assert - Valid chain should pass validation
      expect(blockchain.isChainValid()).toBe(true);
    });

    test('should detect if a block has been tampered with', () => {
      // Arrange - Create blockchain and tamper with a block
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      // Act - Tamper with the data of the second block (index 1)
      blockchain.chain[1].data = {
        sender: 'Hacker',
        receiver: 'Thief',
        amount: 999999,
      };

      // Assert - Tampered chain should fail validation
      expect(blockchain.isChainValid()).toBe(false);
    });

    test('should detect broken chain links', () => {
      // Arrange - Create blockchain and break the chain link
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      // Act - Break the chain by changing a previous hash
      blockchain.chain[2].previousHash = 'invalid_hash_link';

      // Assert - Broken chain should fail validation
      expect(blockchain.isChainValid()).toBe(false);
    });

    test('should detect invalid block hashes', () => {
      // Arrange - Create blockchain and corrupt a hash
      blockchain.addBlock(mockTransactions.transaction1);

      // Act - Corrupt the hash directly
      blockchain.chain[1].hash = 'corrupted_hash_value';

      // Assert - Chain with corrupted hash should fail validation
      expect(blockchain.isChainValid()).toBe(false);
    });

    test('single genesis block should be valid', () => {
      // Assert - Fresh blockchain with only genesis should be valid
      expect(blockchain.isChainValid()).toBe(true);
    });
  });

  describe('Block Retrieval', () => {
    beforeEach(() => {
      // Setup blockchain with multiple blocks for retrieval tests
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);
      blockchain.addBlock(mockTransactions.transaction3);
    });

    test('should retrieve blocks by index', () => {
      // Act & Assert - Should retrieve correct blocks by index
      const genesisBlock = blockchain.getBlockByIndex(0);
      const firstBlock = blockchain.getBlockByIndex(1);
      const secondBlock = blockchain.getBlockByIndex(2);

      expect(genesisBlock).toBe(blockchain.chain[0]);
      expect(firstBlock).toBe(blockchain.chain[1]);
      expect(firstBlock.data).toEqual(mockTransactions.transaction1);
      expect(secondBlock.data).toEqual(mockTransactions.transaction2);
    });

    test('should retrieve blocks by hash', () => {
      // Arrange
      const targetBlock = blockchain.chain[1];
      const targetHash = targetBlock.hash;

      // Act
      const retrievedBlock = blockchain.getBlockByHash(targetHash);

      // Assert - Should find and return the correct block
      expect(retrievedBlock).toBe(targetBlock);
      expect(retrievedBlock.data).toEqual(mockTransactions.transaction1);
    });

    test('should handle invalid block indices gracefully', () => {
      // Act & Assert - Invalid indices should return null or undefined
      expect(blockchain.getBlockByIndex(-1)).toBeNull();
      expect(blockchain.getBlockByIndex(999)).toBeNull();
      expect(blockchain.getBlockByIndex('invalid')).toBeNull();
    });

    test('should handle invalid block hashes gracefully', () => {
      // Act & Assert - Invalid hashes should return null or undefined
      expect(blockchain.getBlockByHash('nonexistent_hash')).toBeNull();
      expect(blockchain.getBlockByHash('')).toBeNull();
      expect(blockchain.getBlockByHash(null)).toBeNull();
    });

    test('should return correct block count', () => {
      // Assert - Should accurately report total number of blocks
      expect(blockchain.getBlockCount()).toBe(4); // Genesis + 3 added blocks

      // Act - Add another block
      blockchain.addBlock({ sender: 'Test', receiver: 'User', amount: 1 });

      // Assert - Count should update
      expect(blockchain.getBlockCount()).toBe(5);
    });
  });
});
