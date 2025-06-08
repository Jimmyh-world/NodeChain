import { describe, test, expect, beforeEach } from 'vitest';
import { Blockchain } from '../models/blockchain.js';
import { Block } from '../models/block.js';

describe('Blockchain', () => {
  let blockchain;

  const mockTransactions = {
    transaction1: {
      sender: 'Alice',
      receiver: 'Bob',
      amount: 50,
    },
    transaction2: {
      sender: 'Bob',
      receiver: 'Charlie',
      amount: 25,
    },
    transaction3: {
      sender: 'Charlie',
      receiver: 'Diana',
      amount: 75,
    },
  };

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  describe('Genesis Block', () => {
    test('should initialize with a valid genesis block', () => {
      expect(blockchain.chain).toBeDefined();
      expect(blockchain.chain.length).toBe(1);
      expect(blockchain.chain[0]).toBeInstanceOf(Block);
    });

    test('genesis block should have correct properties', () => {
      const genesisBlock = blockchain.chain[0];

      expect(genesisBlock.index).toBe(0);
      expect(genesisBlock.previousHash).toBe('0');
      expect(genesisBlock.data).toBeDefined();
      expect(genesisBlock.hash).toBeDefined();
      expect(genesisBlock.timestamp).toBeInstanceOf(Date);
    });

    test('should have a difficulty setting', () => {
      expect(blockchain.difficulty).toBeDefined();
      expect(typeof blockchain.difficulty).toBe('number');
      expect(blockchain.difficulty).toBeGreaterThan(0);
    });
  });

  describe('Block Addition', () => {
    test('should be able to add a new block', () => {
      const initialLength = blockchain.chain.length;

      blockchain.addBlock(mockTransactions.transaction1);

      expect(blockchain.chain.length).toBe(initialLength + 1);
      expect(blockchain.chain[1]).toBeInstanceOf(Block);
    });

    test('new block should link correctly to previous block', () => {
      blockchain.addBlock(mockTransactions.transaction1);
      const newBlock = blockchain.getLatestBlock();
      const previousBlock = blockchain.chain[blockchain.chain.length - 2];

      expect(newBlock.previousHash).toBe(previousBlock.hash);
      expect(newBlock.index).toBe(previousBlock.index + 1);
    });

    test('should store transaction data correctly in new blocks', () => {
      blockchain.addBlock(mockTransactions.transaction2);
      const newBlock = blockchain.getLatestBlock();

      expect(newBlock.data).toEqual(mockTransactions.transaction2);
      expect(newBlock.data.sender).toBe('Bob');
      expect(newBlock.data.amount).toBe(25);
    });
  });

  describe('Chain Validation', () => {
    test('should validate a correct blockchain as valid', () => {
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      expect(blockchain.isChainValid()).toBe(true);
    });

    test('should detect if a block has been tampered with', () => {
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      blockchain.chain[1].data = {
        sender: 'Hacker',
        receiver: 'Thief',
        amount: 999999,
      };

      expect(blockchain.isChainValid()).toBe(false);
    });

    test('should detect broken chain links', () => {
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      blockchain.chain[2].previousHash = 'invalid_hash_link';

      expect(blockchain.isChainValid()).toBe(false);
    });

    test('should detect invalid block hashes', () => {
      blockchain.addBlock(mockTransactions.transaction1);

      blockchain.chain[1].hash = 'corrupted_hash_value';

      expect(blockchain.isChainValid()).toBe(false);
    });
  });

  describe('Block Retrieval', () => {
    test('should retrieve blocks by index', () => {
      blockchain.addBlock(mockTransactions.transaction1);
      blockchain.addBlock(mockTransactions.transaction2);

      const genesisBlock = blockchain.getBlockByIndex(0);
      const firstBlock = blockchain.getBlockByIndex(1);
      const secondBlock = blockchain.getBlockByIndex(2);

      expect(genesisBlock).toBe(blockchain.chain[0]);
      expect(firstBlock).toBe(blockchain.chain[1]);
      expect(firstBlock.data).toEqual(mockTransactions.transaction1);
      expect(secondBlock.data).toEqual(mockTransactions.transaction2);
    });

    test('should handle invalid block indices gracefully', () => {
      expect(blockchain.getBlockByIndex(-1)).toBeNull();
      expect(blockchain.getBlockByIndex(999)).toBeNull();
    });
  });
});
