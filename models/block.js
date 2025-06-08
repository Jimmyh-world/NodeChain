import crypto from 'crypto';

export class Block {
  constructor(index, data, previousHash, difficulty = 4) {
    this.index = index;
    this.timestamp = new Date();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.difficulty = difficulty;

    this.hash = this.mineBlock();
  }

  calculateHash() {
    const blockString =
      this.index +
      this.timestamp.toISOString() +
      JSON.stringify(this.data) +
      this.previousHash +
      this.nonce;

    return crypto.createHash('sha256').update(blockString).digest('hex');
  }

  mineBlock() {
    const target = Array(this.difficulty + 1).join('0');

    while (true) {
      const hash = this.calculateHash();

      if (hash.substring(0, this.difficulty) === target) {
        console.log(`Block mined: ${hash} (nonce: ${this.nonce})`);
        return hash;
      }

      this.nonce++;
    }
  }
}
