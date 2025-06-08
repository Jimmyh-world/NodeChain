import { describe, test, expect } from 'vitest';
import { Block } from '../models/block.js';

describe('Block', () => {
  const mockTransactionData = {
    sender: 'Alice',
    receiver: 'Bob',
    amount: 50,
  };

  const mockPreviousHash = '0000a1b2c3d4e5f6789abcdef1234567890';
  const testDifficulty = 4;

  describe('Block Creation', () => {
    test('should create a block with all required properties', () => {
      const block = new Block(
        1,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      expect(block.index).toBe(1);
      expect(block.data).toEqual(mockTransactionData);
      expect(block.previousHash).toBe(mockPreviousHash);
      expect(block.timestamp).toBeInstanceOf(Date);
      expect(typeof block.nonce).toBe('number');
      expect(typeof block.hash).toBe('string');
    });

    test('should store transaction data with sender, receiver, and amount', () => {
      const transactionData = {
        sender: 'Charlie',
        receiver: 'Diana',
        amount: 123.45,
      };

      const block = new Block(
        2,
        transactionData,
        mockPreviousHash,
        testDifficulty
      );

      expect(block.data.sender).toBe('Charlie');
      expect(block.data.receiver).toBe('Diana');
      expect(block.data.amount).toBe(123.45);
    });
  });

  describe('Proof of Work', () => {
    test('should produce a hash that meets the specified difficulty', () => {
      const block = new Block(
        1,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      const expectedPrefix = '0'.repeat(testDifficulty);
      expect(block.hash).toMatch(new RegExp(`^${expectedPrefix}`));
    });

    test('should have different hashes for different blocks', () => {
      const data1 = { sender: 'Alice', receiver: 'Bob', amount: 10 };
      const data2 = { sender: 'Bob', receiver: 'Charlie', amount: 20 };

      const block1 = new Block(1, data1, mockPreviousHash, testDifficulty);
      const block2 = new Block(2, data2, block1.hash, testDifficulty);

      expect(block1.hash).not.toBe(block2.hash);
      expect(block1.hash).toMatch(/^0{4}/);
      expect(block2.hash).toMatch(/^0{4}/);
    });
  });

  describe('Block Validation', () => {
    test('should link to previous block correctly', () => {
      const block = new Block(
        5,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      expect(block.previousHash).toBe(mockPreviousHash);
    });
  });
});
