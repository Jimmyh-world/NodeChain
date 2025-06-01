import express from 'express';
import {
  createBlock,
  getAllBlocks,
  getBlockById,
} from '../controllers/blockController.js';

/**
 * Block Routes for NodeChain REST API
 * Defines basic blockchain HTTP endpoints
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
 * @body    { sender: string, receiver: string, amount: number }
 */
router.post('/', createBlock);

/**
 * @route   GET /blocks/:id
 * @desc    Get a specific block by index
 * @access  Public
 * @param   id - Block index (0, 1, 2...)
 */
router.get('/:id', getBlockById);

export default router;
