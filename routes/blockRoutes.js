import express from 'express';
import {
  createBlock,
  getAllBlocks,
  getBlockById,
  getBlockchainStats,
} from '../controllers/blockController.js';

/**
 * Block Routes for NodeChain REST API
 * Defines all blockchain-related HTTP endpoints
 */

const router = express.Router();

/**
 * @route   GET /blocks
 * @desc    Get all blocks in the blockchain
 * @access  Public
 */
router.get('/', getAllBlocks);

/**
 * @route   POST /blocks
 * @desc    Create a new block with transaction data
 * @access  Public
 * @body    { sender: string, receiver: string, amount: number, metadata?: object }
 */
router.post('/', createBlock);

/**
 * @route   GET /blocks/stats
 * @desc    Get blockchain statistics and health information
 * @access  Public
 */
router.get('/stats', getBlockchainStats);

/**
 * @route   GET /blocks/:id
 * @desc    Get a specific block by index (number) or hash (string)
 * @access  Public
 * @param   id - Block index (0, 1, 2...) or hash (0x123abc...)
 */
router.get('/:id', getBlockById);

export default router;
