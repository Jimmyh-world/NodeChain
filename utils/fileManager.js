import fs from 'fs/promises';
import path from 'path';
import { Blockchain } from '../models/blockchain.js';
import { Block } from '../models/block.js';
import logger from './logger.js';

/**
 * File Manager for NodeChain blockchain persistence
 * Handles saving and loading blockchain data to/from JSON files
 */

const BLOCKCHAIN_FILE = path.join(process.cwd(), 'blockchain.json');

/**
 * Saves the current blockchain state to a JSON file
 * @param {Blockchain} blockchain - The blockchain instance to save
 * @returns {Promise<boolean>} True if save successful, false otherwise
 */
export const saveBlockchain = async (blockchain) => {
  try {
    // Prepare blockchain data for serialization
    const blockchainData = {
      difficulty: blockchain.difficulty,
      chain: blockchain.chain.map((block) => ({
        index: block.index,
        timestamp: block.timestamp.toISOString(), // Convert Date to string
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce,
      })),
      metadata: {
        savedAt: new Date().toISOString(),
        blockCount: blockchain.getBlockCount(),
        isValid: blockchain.isChainValid(),
      },
    };

    // Write to file with proper formatting
    await fs.writeFile(
      BLOCKCHAIN_FILE,
      JSON.stringify(blockchainData, null, 2),
      'utf8'
    );

    logger.info(`Blockchain saved successfully to ${BLOCKCHAIN_FILE}`);
    logger.info(
      `Saved ${blockchainData.chain.length} blocks with difficulty ${blockchainData.difficulty}`
    );

    return true;
  } catch (error) {
    logger.error(`Failed to save blockchain: ${error.message}`);
    logger.error(`File path: ${BLOCKCHAIN_FILE}`);
    return false;
  }
};

/**
 * Loads blockchain data from JSON file and reconstructs Blockchain instance
 * @returns {Promise<Blockchain|null>} Reconstructed Blockchain instance or null if failed
 */
export const loadBlockchain = async () => {
  try {
    // Check if blockchain file exists
    try {
      await fs.access(BLOCKCHAIN_FILE);
    } catch (accessError) {
      logger.info(`No existing blockchain file found at ${BLOCKCHAIN_FILE}`);
      logger.info('Will create new blockchain on first startup');
      return null;
    }

    // Read and parse blockchain file
    const fileContent = await fs.readFile(BLOCKCHAIN_FILE, 'utf8');

    if (!fileContent.trim()) {
      logger.error('Blockchain file is empty');
      return null;
    }

    const blockchainData = JSON.parse(fileContent);

    // Validate basic structure
    if (!blockchainData.chain || !Array.isArray(blockchainData.chain)) {
      logger.error(
        'Invalid blockchain file structure - missing or invalid chain'
      );
      return null;
    }

    // Create new blockchain instance
    const blockchain = new Blockchain(blockchainData.difficulty || 4);

    // Clear the default genesis block (we'll replace with loaded data)
    blockchain.chain = [];

    // Reconstruct Block instances from saved data
    for (const blockData of blockchainData.chain) {
      // Validate required block properties
      if (
        !blockData.hasOwnProperty('index') ||
        !blockData.hasOwnProperty('timestamp') ||
        !blockData.hasOwnProperty('data') ||
        !blockData.hasOwnProperty('previousHash') ||
        !blockData.hasOwnProperty('hash') ||
        !blockData.hasOwnProperty('nonce')
      ) {
        logger.error(
          `Invalid block structure at index ${blockData.index || 'unknown'}`
        );
        return null;
      }

      // Create new Block instance with saved data
      const block = new Block(
        blockData.index,
        blockData.data,
        blockData.previousHash,
        blockchain.difficulty
      );

      // Override the automatically generated properties with saved values
      block.timestamp = new Date(blockData.timestamp);
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;

      // Add to blockchain
      blockchain.chain.push(block);
    }

    // Validate the loaded blockchain
    const isValid = blockchain.isChainValid();
    if (!isValid) {
      logger.error(
        'Loaded blockchain failed validation - data may be corrupted'
      );
      logger.error('Consider deleting blockchain.json to start fresh');
      return null;
    }

    logger.info(`Blockchain loaded successfully from ${BLOCKCHAIN_FILE}`);
    logger.info(
      `Loaded ${blockchain.getBlockCount()} blocks with difficulty ${
        blockchain.difficulty
      }`
    );
    logger.info(`Latest block hash: ${blockchain.getLatestBlock().hash}`);

    return blockchain;
  } catch (error) {
    if (error instanceof SyntaxError) {
      logger.error(`Blockchain file contains invalid JSON: ${error.message}`);
    } else {
      logger.error(`Failed to load blockchain: ${error.message}`);
    }
    logger.error(`File path: ${BLOCKCHAIN_FILE}`);
    return null;
  }
};

/**
 * Creates a backup of the current blockchain file
 * @returns {Promise<boolean>} True if backup successful, false otherwise
 */
export const backupBlockchain = async () => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(
      process.cwd(),
      `blockchain-backup-${timestamp}.json`
    );

    await fs.copyFile(BLOCKCHAIN_FILE, backupFile);

    logger.info(`Blockchain backup created: ${backupFile}`);
    return true;
  } catch (error) {
    logger.error(`Failed to create blockchain backup: ${error.message}`);
    return false;
  }
};

/**
 * Checks if blockchain file exists
 * @returns {Promise<boolean>} True if file exists, false otherwise
 */
export const blockchainFileExists = async () => {
  try {
    await fs.access(BLOCKCHAIN_FILE);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets blockchain file information
 * @returns {Promise<Object|null>} File stats or null if file doesn't exist
 */
export const getBlockchainFileInfo = async () => {
  try {
    const stats = await fs.stat(BLOCKCHAIN_FILE);
    const fileContent = await fs.readFile(BLOCKCHAIN_FILE, 'utf8');
    const blockchainData = JSON.parse(fileContent);

    return {
      exists: true,
      size: stats.size,
      lastModified: stats.mtime,
      blockCount: blockchainData.chain ? blockchainData.chain.length : 0,
      difficulty: blockchainData.difficulty || 'unknown',
      savedAt: blockchainData.metadata?.savedAt || 'unknown',
    };
  } catch {
    return { exists: false };
  }
};
