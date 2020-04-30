const Block = require('./block');
const {cryptoHash}=require('../util');
const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA,MINE_RATE} = require('../config');

describe('Block',()=>{
	const timestamp=2000;
	const lasthash='temp-lasthash';
	const hash='temp-hash';
	const data=['data1','data2'];
	let nonce=1;
	const difficulty=1;
	const block=new Block({
		timestamp:timestamp,
		lasthash:lasthash,
		hash:hash,
		data:data,
		nonce:nonce,
		difficulty:difficulty
	});

	it('has timestamp,lasthash,hash,data property',()=>{
		expect(block.timestamp).toEqual(timestamp);
		expect(block.lasthash).toEqual(lasthash);
		expect(block.hash).toEqual(hash);
		expect(block.data).toEqual(data);
		expect(block.nonce).toEqual(nonce);
		expect(block.difficulty).toEqual(difficulty);
	});

	describe('genesis()',()=>{
		const genesisBlock = Block.genesis();

		it('returns block instance',()=>{
			expect(genesisBlock instanceof Block).toBe(true);
		});

		it('returns genesis data',()=>{
			expect(genesisBlock).toEqual(GENESIS_DATA);
		});
	});

	describe('mineBlock()',()=>{
		const lastBlock=Block.genesis();
		const data='mined data';
		const minedBlock=Block.minedBlock({lastBlock,data});

		it('returns block instance',()=>{
			expect(minedBlock instanceof Block).toBe(true);
		});

		it('sets `lasthash` to `hash` of previous block',()=>{
			expect(minedBlock.lasthash).toEqual(lastBlock.hash);
		});

		it('sets `data`',()=>{
			expect(minedBlock.data).toEqual(data);
		});

		it('sets a `timestamp`',()=>{
			expect(minedBlock.timestamp).not.toEqual(undefined);
		});

		it('creates a sha256 hash',()=>{
			expect(minedBlock.hash).toEqual(cryptoHash(
				minedBlock.timestamp,
				minedBlock.nonce,
				minedBlock.difficulty,
				data,
				lastBlock.hash,
			));
		});

		it('set a `hash` that matches diff criteria',()=>{
			expect(hexToBinary(minedBlock.hash).substring(0,minedBlock.difficulty)).toEqual('0'.repeat(minedBlock.difficulty));
		});

		it('adjusts difficulty',()=>{
			const possibleResults=[lastBlock.difficulty+1,lastBlock.difficulty-1];

			expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
		});
	});

	describe('adjustDifficulty()',()=>{
		it('raises block difficulty',()=>{
			expect(Block.adjustDifficulty({originalBlock:block,timestamp:block.timestamp+MINE_RATE-100})).toEqual(block.difficulty+1);
		});

		it('lowers block difficulty',()=>{
			expect(Block.adjustDifficulty({originalBlock:block,timestamp:block.timestamp+MINE_RATE+100})).toEqual(block.difficulty-1);
		});

		it('set lower base to 1',()=>{
			block.difficulty=-1;

			expect(Block.adjustDifficulty({originalBlock:block,timestamp})).toEqual(1);
		});
	});
});