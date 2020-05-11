const Block=require('./block');
const {cryptoHash}=require('../util');
const Transaction=require('../wallet/transaction');
const Wallet=require('../wallet');

const {REWARD_INPUT,MINING_REWARD}=require('../config');

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
	
	
	replaceChain(chain,validateTransactions,onSuccess){
		if(chain.length <= this.chain.length){
			console.error('Input chain is short');
			return;
		}

		if(!Blockchain.isValidChain(chain)){
			console.error('Input chain is invalid');
			return;
		}

		if(validateTransactions && !this.validTransactionData({chain})){
			console.error('Incoming chain has invalid transaction data');
			return;
		}

		if (onSuccess) {
			onSuccess();
		}
		
		console.log('replacing chain with',chain);
		this.chain=chain;
	}

	validTransactionData({chain}){
		for(let a=1;a<chain.length;a++){
			const block=chain[a];
			const transactionSet=new Set();
			let rewardTransactionCount=0;

			for(let transaction of block.data){
				if(transaction.input.address===REWARD_INPUT.address){
					rewardTransactionCount+=1;

					if(rewardTransactionCount>1){
						console.error('Miner reward exceeds limit');
						return false;
					}

					if(Object.values(transaction.outputMap)[0]!==MINING_REWARD){
						console.error('Miner reward is invalid');
						return false;
					} 
				} else {
					if(!Transaction.validTransaction(transaction)){
						console.error('Invalid transaction');
						return false;
					}

					const trueBalance = Wallet.calculateBalance({
						chain:this.chain,
						address:transaction.input.address
					});

					if(transaction.input.amount!==trueBalance){
						console.error('Incorrect input amount');
						return false;
					}

					if(transactionSet.has(transaction)){
						console.error('Duplicate transaction appears');
						return false;
					} else {
						transactionSet.add(transaction);
					}
				}
			}
		}
		return true;
	}
}

module.exports=Blockchain;