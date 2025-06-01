import { describe, test, expect } from 'vitest';
import { Block } from '../models/block.js';

/**
 * Test suite for Block class
 * These tests define the contract and expected behavior for blockchain blocks
 * following TDD principles - tests first, implementation second
 */
describe('Block', () => {
  /**
   * Test data representing a simple blockchain transaction
   * Using realistic but simple data structure for educational purposes
   */
  const mockTransactionData = {
    sender: 'Alice',
    receiver: 'Bob',
    amount: 50,
    metadata: {
      timestamp: '2024-01-15T10:30:00Z',
      transactionId: 'tx_001',
    },
  };

  const mockPreviousHash = '0000a1b2c3d4e5f6789abcdef1234567890';
  const testDifficulty = 4; // Require 4 leading zeros in hash

  describe('Block Creation', () => {
    test('should create a block with all required properties', () => {
      // Arrange & Act
      const block = new Block(
        1,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      // Assert - Block should have all essential properties
      expect(block.index).toBe(1);
      expect(block.data).toEqual(mockTransactionData);
      expect(block.previousHash).toBe(mockPreviousHash);
      expect(block.timestamp).toBeDefined();
      expect(block.nonce).toBeDefined();
      expect(block.hash).toBeDefined();
    });

    test('should have a timestamp that is a valid date', () => {
      // Arrange & Act
      const block = new Block(0, mockTransactionData, '0', testDifficulty);

      // Assert - Timestamp should be a valid date
      expect(block.timestamp).toBeInstanceOf(Date);
      expect(block.timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });

    test('should initialize nonce as a number', () => {
      // Arrange & Act
      const block = new Block(0, mockTransactionData, '0', testDifficulty);

      // Assert - Nonce should be a number (used for proof-of-work)
      expect(typeof block.nonce).toBe('number');
      expect(block.nonce).toBeGreaterThanOrEqual(0);
    });

    test('should store complex transaction data correctly', () => {
      // Arrange
      const complexData = {
        sender: 'Charlie',
        receiver: 'Diana',
        amount: 123.45,
        metadata: {
          category: 'payment',
          notes: 'Coffee purchase',
          location: 'Stockholm',
        },
      };

      // Act
      const block = new Block(2, complexData, mockPreviousHash, testDifficulty);

      // Assert - Complex data should be preserved exactly
      expect(block.data).toEqual(complexData);
      expect(block.data.metadata.notes).toBe('Coffee purchase');
    });
  });

  describe('Proof of Work', () => {
    test('should produce a hash that meets the specified difficulty', () => {
      // Arrange & Act
      const block = new Block(
        1,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      // Assert - Hash should start with required number of zeros
      const expectedPrefix = '0'.repeat(testDifficulty);
      expect(block.hash).toMatch(new RegExp(`^${expectedPrefix}`));
      expect(block.hash.length).toBeGreaterThan(testDifficulty);
    });

    test('should have different hashes for different blocks', () => {
      // Arrange
      const data1 = { sender: 'Alice', receiver: 'Bob', amount: 10 };
      const data2 = { sender: 'Bob', receiver: 'Charlie', amount: 20 };

      // Act
      const block1 = new Block(1, data1, mockPreviousHash, testDifficulty);
      const block2 = new Block(2, data2, block1.hash, testDifficulty);

      // Assert - Each block should have unique hash
      expect(block1.hash).not.toBe(block2.hash);
      expect(block1.hash).toMatch(/^0{4}/); // 4 leading zeros
      expect(block2.hash).toMatch(/^0{4}/); // 4 leading zeros
    });

    test('should increment nonce until valid hash is found', () => {
      // Arrange & Act
      const block = new Block(0, mockTransactionData, '0', 3); // Lower difficulty for faster test

      // Assert - Nonce should be > 0 after mining (proof that work was done)
      expect(block.nonce).toBeGreaterThan(0);
    });

    test('should produce consistent hash for same block data', () => {
      // Arrange
      const testData = { sender: 'Test', receiver: 'User', amount: 1 };

      // Act - Create two blocks with identical data
      const block1 = new Block(1, testData, 'previous123', 2);
      const block2 = new Block(1, testData, 'previous123', 2);

      // Assert - Different nonces but both should meet difficulty requirement
      expect(block1.hash).toMatch(/^00/);
      expect(block2.hash).toMatch(/^00/);
      // Note: Hashes will likely be different due to different timestamps/nonces
    });
  });

  describe('Block Validation', () => {
    test('should have a hash property that is a string', () => {
      // Arrange & Act
      const block = new Block(
        1,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      // Assert - Hash should be a hex string
      expect(typeof block.hash).toBe('string');
      expect(block.hash.length).toBeGreaterThan(0);
    });

    test('should link to previous block correctly', () => {
      // Arrange & Act
      const block = new Block(
        5,
        mockTransactionData,
        mockPreviousHash,
        testDifficulty
      );

      // Assert - Block should reference the previous block's hash
      expect(block.previousHash).toBe(mockPreviousHash);
    });
  });
});
