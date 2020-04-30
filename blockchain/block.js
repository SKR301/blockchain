const {GENESIS_DATA,MINE_RATE}=require('../config');
const {cryptoHash}=require('../util');
const hexToBinary = require('hex-to-binary');

class Block {
	constructor({timestamp,lasthash,hash,data,nonce,difficulty}) {
		this.timestamp=timestamp;
		this.lasthash=lasthash;
		this.hash=hash;
		this.data=data;
		this.nonce=nonce;
		this.difficulty=difficulty;
	}

	static genesis() {
		return new this(GENESIS_DATA);
	}

	static minedBlock({lastBlock,data}) {

		let hash,timestamp;
		const lasthash=lastBlock.hash;
		let {difficulty}=lastBlock;
		let nonce=0;

		do{
			timestamp=Date.now();
			nonce++;
			difficulty=Block.adjustDifficulty({originalBlock:lastBlock,timestamp});
			hash=cryptoHash(timestamp,lasthash,data,difficulty,nonce);
		}while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty));

		return new this({
			timestamp:timestamp,
			lasthash:lasthash,
			data:data,
			difficulty:difficulty,
			nonce:nonce,
			hash:hash
		});
	}

	static adjustDifficulty({originalBlock,timestamp}){
		const {difficulty}=originalBlock;

		if(difficulty<0){
			return 1;
		}

		if(timestamp-originalBlock.timestamp>MINE_RATE){
			return difficulty-1;
		}
		return difficulty+1;
	};
}

module.exports=Block;