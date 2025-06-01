import fs from 'fs/promises';
import path from 'path';
import { Blockchain } from '../models/blockchain.js';
import { Block } from '../models/block.js';
import logger from './logger.js';

/**
 * Simple file manager for NodeChain blockchain persistence
 * Handles basic saving and loading of blockchain data
 */

const BLOCKCHAIN_FILE = path.join(process.cwd(), 'blockchain.json');

/**
 * Saves the current blockchain state to a JSON file
 * @param {Blockchain} blockchain - The blockchain instance to save
 * @returns {Promise<boolean>} True if save successful, false otherwise
 */
export const saveBlockchain = async (blockchain) => {
  try {
    const blockchainData = {
      difficulty: blockchain.difficulty,
      chain: blockchain.chain.map((block) => ({
        index: block.index,
        timestamp: block.timestamp.toISOString(),
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce,
      })),
    };

    await fs.writeFile(
      BLOCKCHAIN_FILE,
      JSON.stringify(blockchainData, null, 2),
      'utf8'
    );

    logger.info(`Blockchain saved with ${blockchainData.chain.length} blocks`);
    return true;
  } catch (error) {
    logger.error(`Failed to save blockchain: ${error.message}`);
    return false;
  }
};

/**
 * Loads blockchain data from JSON file and reconstructs Blockchain instance
 * @returns {Promise<Blockchain|null>} Reconstructed Blockchain instance or null if failed
 */
export const loadBlockchain = async () => {
  try {
    // Check if file exists
    await fs.access(BLOCKCHAIN_FILE);

    // Read and parse blockchain file
    const fileContent = await fs.readFile(BLOCKCHAIN_FILE, 'utf8');
    const blockchainData = JSON.parse(fileContent);

    // Basic validation
    if (!blockchainData.chain || !Array.isArray(blockchainData.chain)) {
      logger.error('Invalid blockchain file structure');
      return null;
    }

    // Create new blockchain instance
    const blockchain = new Blockchain(blockchainData.difficulty || 4);
    blockchain.chain = [];

    // Reconstruct blocks
    for (const blockData of blockchainData.chain) {
      const block = new Block(
        blockData.index,
        blockData.data,
        blockData.previousHash,
        blockchain.difficulty
      );

      // Set saved values
      block.timestamp = new Date(blockData.timestamp);
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;

      blockchain.chain.push(block);
    }

    // Validate loaded chain
    if (!blockchain.isChainValid()) {
      logger.error('Loaded blockchain failed validation');
      return null;
    }

    logger.info(`Blockchain loaded with ${blockchain.getBlockCount()} blocks`);
    return blockchain;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.info('No existing blockchain file found');
      return null;
    }
    logger.error(`Failed to load blockchain: ${error.message}`);
    return null;
  }
};
