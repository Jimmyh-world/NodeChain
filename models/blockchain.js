import { Block } from './block.js';

export class Blockchain {
  constructor(difficulty = 4) {
    this.chain = [];
    this.difficulty = difficulty;

    this.createGenesisBlock();
  }

  createGenesisBlock() {
    const genesisData = {
      sender: 'Genesis',
      receiver: 'Genesis',
      amount: 0,
      metadata: {
        timestamp: new Date().toISOString(),
        transactionId: 'genesis_block',
      },
    };

    const genesisBlock = new Block(0, genesisData, '0', this.difficulty);
    this.chain.push(genesisBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock.index + 1;
    const previousHash = previousBlock.hash;

    const newBlock = new Block(newIndex, data, previousHash, this.difficulty);

    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      const target = Array(this.difficulty + 1).join('0');
      if (currentBlock.hash.substring(0, this.difficulty) !== target) {
        return false;
      }
    }

    return true;
  }

  getBlockByIndex(index) {
    if (typeof index !== 'number' || index < 0 || index >= this.chain.length) {
      return null;
    }

    return this.chain[index];
  }

  getBlockByHash(hash) {
    if (!hash || typeof hash !== 'string') {
      return null;
    }

    for (let i = 0; i < this.chain.length; i++) {
      if (this.chain[i].hash === hash) {
        return this.chain[i];
      }
    }

    return null;
  }

  getBlockCount() {
    return this.chain.length;
  }
}
