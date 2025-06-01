import { Blockchain } from '../models/blockchain.js';
import { createError, asyncHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Block Controller for NodeChain REST API
 * Handles all blockchain-related HTTP requests and responses
 */

// In-memory blockchain instance (mocking file persistence for now)
// TODO: Replace with file-based persistence in next phase
let blockchain = new Blockchain(4); // Difficulty of 4 for reasonable mining time

/**
 * Creates a new block with the provided transaction data
 * POST /blocks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const createBlock = asyncHandler(async (req, res, next) => {
  const { sender, receiver, amount, metadata } = req.body;

  // Validate required fields
  if (!sender || !receiver || amount === undefined) {
    return next(
      createError(
        'Missing required fields: sender, receiver, and amount are required',
        400,
        'ValidationError'
      )
    );
  }

  // Validate amount is a number
  if (typeof amount !== 'number' || amount < 0) {
    return next(
      createError('Amount must be a positive number', 400, 'ValidationError')
    );
  }

  // Validate sender and receiver are strings
  if (typeof sender !== 'string' || typeof receiver !== 'string') {
    return next(
      createError('Sender and receiver must be strings', 400, 'ValidationError')
    );
  }

  try {
    // Prepare transaction data
    const transactionData = {
      sender: sender.trim(),
      receiver: receiver.trim(),
      amount,
      metadata: {
        timestamp: new Date().toISOString(),
        transactionId: `tx_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        ...metadata, // Include any additional metadata from request
      },
    };

    // Add block to blockchain (this will trigger mining)
    logger.info(
      `Starting to mine new block for transaction: ${sender} -> ${receiver} (${amount})`
    );
    blockchain.addBlock(transactionData);

    const newBlock = blockchain.getLatestBlock();
    logger.info(`Block mined successfully: ${newBlock.hash}`);

    // Return success response with new block data
    res.status(201).json({
      success: true,
      message: 'Block created and mined successfully',
      data: {
        block: {
          index: newBlock.index,
          timestamp: newBlock.timestamp,
          data: newBlock.data,
          previousHash: newBlock.previousHash,
          hash: newBlock.hash,
          nonce: newBlock.nonce,
        },
        chainLength: blockchain.getBlockCount(),
        difficulty: blockchain.difficulty,
      },
    });
  } catch (error) {
    logger.error(`Block creation failed: ${error.message}`);
    return next(
      createError('Failed to create and mine block', 500, 'MiningError')
    );
  }
});

/**
 * Retrieves all blocks in the blockchain
 * GET /blocks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getAllBlocks = asyncHandler(async (req, res, next) => {
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
      data: {
        blocks,
        chainLength: blockchain.getBlockCount(),
        isValid: blockchain.isChainValid(),
        difficulty: blockchain.difficulty,
      },
    });
  } catch (error) {
    logger.error(`Failed to retrieve blocks: ${error.message}`);
    return next(
      createError('Failed to retrieve blockchain data', 500, 'BlockchainError')
    );
  }
});

/**
 * Retrieves a specific block by index or hash
 * GET /blocks/:id
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getBlockById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(createError('Block ID is required', 400, 'ValidationError'));
  }

  try {
    let block = null;

    // Check if ID is a number (index) or string (hash)
    const numericId = parseInt(id);

    if (!isNaN(numericId) && numericId.toString() === id) {
      // ID is a valid integer, search by index
      block = blockchain.getBlockByIndex(numericId);
      logger.info(`Searching for block by index: ${numericId}`);
    } else {
      // ID is a string, search by hash
      block = blockchain.getBlockByHash(id);
      logger.info(`Searching for block by hash: ${id}`);
    }

    if (!block) {
      return next(
        createError(`Block not found with ID: ${id}`, 404, 'BlockchainError')
      );
    }

    logger.info(`Block found: index ${block.index}, hash ${block.hash}`);

    res.json({
      success: true,
      message: 'Block retrieved successfully',
      data: {
        block: {
          index: block.index,
          timestamp: block.timestamp,
          data: block.data,
          previousHash: block.previousHash,
          hash: block.hash,
          nonce: block.nonce,
        },
      },
    });
  } catch (error) {
    logger.error(`Failed to retrieve block with ID ${id}: ${error.message}`);
    return next(
      createError('Failed to retrieve block data', 500, 'BlockchainError')
    );
  }
});

/**
 * Gets blockchain statistics and health information
 * GET /blocks/stats (this would be handled by a separate route)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const getBlockchainStats = asyncHandler(async (req, res, next) => {
  try {
    const stats = {
      totalBlocks: blockchain.getBlockCount(),
      difficulty: blockchain.difficulty,
      isValid: blockchain.isChainValid(),
      latestBlock: {
        index: blockchain.getLatestBlock().index,
        hash: blockchain.getLatestBlock().hash,
        timestamp: blockchain.getLatestBlock().timestamp,
      },
    };

    logger.info('Blockchain statistics requested');

    res.json({
      success: true,
      message: 'Blockchain statistics retrieved successfully',
      data: stats,
    });
  } catch (error) {
    logger.error(`Failed to retrieve blockchain stats: ${error.message}`);
    return next(
      createError(
        'Failed to retrieve blockchain statistics',
        500,
        'BlockchainError'
      )
    );
  }
});
