import express from 'express';
import {
  createBlock,
  getAllBlocks,
  getBlockById,
} from '../controllers/blockController.js';

const router = express.Router();

router.get('/', getAllBlocks);

router.post('/', createBlock);

router.get('/:id', getBlockById);

export default router;
