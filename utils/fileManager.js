import fs from 'fs/promises';
import path from 'path';
import { Blockchain } from '../models/blockchain.js';
import { Block } from '../models/block.js';
import logger from './logger.js';

const BLOCKCHAIN_FILE = path.join(process.cwd(), 'blockchain.json');

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

export const loadBlockchain = async () => {
  try {
    await fs.access(BLOCKCHAIN_FILE);

    const fileContent = await fs.readFile(BLOCKCHAIN_FILE, 'utf8');
    const blockchainData = JSON.parse(fileContent);

    if (!blockchainData.chain || !Array.isArray(blockchainData.chain)) {
      logger.error('Invalid blockchain file structure');
      return null;
    }

    const blockchain = new Blockchain(blockchainData.difficulty || 4);
    blockchain.chain = [];

    for (const blockData of blockchainData.chain) {
      const block = new Block(
        blockData.index,
        blockData.data,
        blockData.previousHash,
        blockchain.difficulty
      );

      block.timestamp = new Date(blockData.timestamp);
      block.hash = blockData.hash;
      block.nonce = blockData.nonce;

      blockchain.chain.push(block);
    }

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
