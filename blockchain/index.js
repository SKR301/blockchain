const Block=require('./block');
const {cryptoHash}=require('../util');

class Blockchain{
	constructor(){
		this.chain=[Block.genesis()];
	}

	addBlock({data}){
		const newBlock = Block.minedBlock({
			lastBlock:this.chain[this.chain.length-1],
			data:data
		});

		this.chain.push(newBlock);
	}

	static isValidChain(chain){
		if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())){
			return false;
		}

		for(let a=1;a<chain.length;a++){
			const {timestamp,lasthash,hash,nonce,difficulty,data}=chain[a];
			const actualLastHash=chain[a-1].hash;

			if(lasthash!==actualLastHash){
				return false;
			}

			const validatedHash=cryptoHash(timestamp,lasthash,data,nonce,difficulty);
			if(validatedHash!==hash){
				return false;
			}

			const lastDifficulty=chain[a-1].difficulty;
			if(Math.abs(lastDifficulty-difficulty>1)){
				return false;
			}
		}
		return true;
	}

	replaceChain(chain){
		if(chain.length<=this.chain.length){
			console.error('Input chain is short');
			return;
		}

		if(!Blockchain.isValidChain(chain)){
			console.error('Input chain is invalid');
			return;
		}

		console.log('replacing chain with',chain);
		this.chain=chain;
	}
}

module.exports=Blockchain;