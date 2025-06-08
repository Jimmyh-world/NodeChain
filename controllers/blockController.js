import { Blockchain } from '../models/blockchain.js';
import { createError } from '../utils/errorHandler.js';
import { saveBlockchain, loadBlockchain } from '../utils/fileManager.js';
import logger from '../utils/logger.js';

let blockchain = null;

const initializeBlockchain = async () => {
  try {
    logger.info('Initializing blockchain controller...');

    blockchain = await loadBlockchain();

    if (!blockchain) {
      logger.info('Creating new blockchain instance');
      blockchain = new Blockchain(4);
      await saveBlockchain(blockchain);
    }

    logger.info(
      `Blockchain initialized with ${blockchain.getBlockCount()} blocks`
    );
  } catch (error) {
    logger.error(`Failed to initialize blockchain: ${error.message}`);
    blockchain = new Blockchain(4);
  }
};

await initializeBlockchain();

export const createBlock = async (req, res, next) => {
  try {
    const { sender, receiver, amount } = req.body;

    if (!sender || !receiver || amount === undefined) {
      return next(
        createError(
          'Missing required fields: sender, receiver, and amount are required',
          400
        )
      );
    }

    if (typeof amount !== 'number' || amount < 0) {
      return next(createError('Amount must be a positive number', 400));
    }

    if (typeof sender !== 'string' || typeof receiver !== 'string') {
      return next(createError('Sender and receiver must be strings', 400));
    }

    const transactionData = {
      sender: sender.trim(),
      receiver: receiver.trim(),
      amount,
    };

    logger.info(
      `Mining new block for transaction: ${sender} -> ${receiver} (${amount})`
    );
    blockchain.addBlock(transactionData);

    const newBlock = blockchain.getLatestBlock();
    logger.info(`Block mined successfully: ${newBlock.hash}`);

    await saveBlockchain(blockchain);

    res.status(201).json({
      success: true,
      message: 'Block created and mined successfully',
      data: {
        index: newBlock.index,
        timestamp: newBlock.timestamp,
        data: newBlock.data,
        previousHash: newBlock.previousHash,
        hash: newBlock.hash,
        nonce: newBlock.nonce,
      },
    });
  } catch (error) {
    logger.error(`Block creation failed: ${error.message}`);
    next(createError('Failed to create and mine block', 500));
  }
};

export const getAllBlocks = async (_req, res, next) => {
  try {
    const blocks = blockchain.chain.map((block) => ({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash,
      hash: block.hash,
      nonce: block.nonce,
    }));

    logger.info(`Retrieved all blocks (${blocks.length} blocks)`);

    res.json({
      success: true,
      message: `Retrieved ${blocks.length} blocks from blockchain`,
      data: blocks,
    });
  } catch (error) {
    logger.error(`Failed to retrieve blocks: ${error.message}`);
    next(createError('Failed to retrieve blockchain data', 500));
  }
};

export const getBlockById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(createError('Block ID is required', 400));
    }

    const index = parseInt(id);
    if (isNaN(index) || index.toString() !== id) {
      return next(createError('Block ID must be a valid index number', 400));
    }

    const block = blockchain.getBlockByIndex(index);

    if (!block) {
      return next(createError(`Block not found at index: ${index}`, 404));
    }

    logger.info(`Block retrieved: index ${block.index}`);

    res.json({
      success: true,
      message: 'Block retrieved successfully',
      data: {
        index: block.index,
        timestamp: block.timestamp,
        data: block.data,
        previousHash: block.previousHash,
        hash: block.hash,
        nonce: block.nonce,
      },
    });
  } catch (error) {
    logger.error(`Failed to retrieve block: ${error.message}`);
    next(createError('Failed to retrieve block data', 500));
  }
};
