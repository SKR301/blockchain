const Blockchain = require('./index');
const Block = require('./block');
const {cryptoHash}=require('../util');


describe('Blockchain',()=>{
	let blockchain,newChain,originalChain;

	beforeEach(()=>{
 		blockchain = new Blockchain();
 		newChain=new Blockchain();
 		originalChain=blockchain.chain;
	});

	it('contain a `chain` array instance',()=>{
		expect(blockchain.chain instanceof Array).toBe(true);
	});


	it('starts with genesis block',()=>{
		expect(blockchain.chain[0]).toEqual(Block.genesis());
	});


	it('add block function is working',()=>{
		const newData='temp data';
		blockchain.addBlock({data:newData});
		expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
	});

	describe('isValidChain()',()=>{
		describe('when chain doesnt start with genesis',()=>{
			it('returns false',()=>{
				blockchain.chain[0]={data:'fake-genesis'};

				expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
			});
		});

		describe('when chain start with genesis have multiple blocks',()=>{

			beforeEach(()=>{
				blockchain.addBlock({data:'skr3'});
				blockchain.addBlock({data:'skr0'});
				blockchain.addBlock({data:'skr1'});
			});

			describe('`lasthash` reference has changed',()=>{
				it('returns false',()=>{
					blockchain.chain[2].lasthash='broke';
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('`chain` contains invalid field',()=>{
				it('returns false',()=>{
					blockchain.chain[1].data='saurav';
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});

			describe('edit the difficulty',()=>{
				it('returns false',()=>{
					const lastBlock=blockchain.chain[blockchain.chain.length-1];
					const lasthash=lastBlock.hash;
					const timestamp=Date.now();
					const nonce=0;
					const data=[];
					const difficulty=lastBlock.difficulty-3;
					const hash=cryptoHash(timestamp,lasthash,nonce,difficulty,data);

					const badBlock = new Block({
						timestamp:timestamp,
						lasthash:lasthash,
						data:data,
						difficulty:difficulty,
						nonce:nonce,
						hash:hash
					});

					blockchain.chain.push(badBlock);

					expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
				});
			});
			
			describe('`chain` is valid',()=>{
				it('returns true',()=>{
					expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
				});
			});
		});
	});

	describe('replaceChain()',()=>{
		let errorMock,logMock;

		beforeEach(()=>{
			errorMock=jest.fn();
			logMock=jest.fn();

			global.console.error=errorMock;
			global.console.log=logMock;
		});


		describe('chain is not longer',()=>{
			beforeEach(()=>{
				newChain.chain[0]={new:'chain'};
				blockchain.replaceChain(newChain.chain);
			});

			it('does not replace the chain',()=>{
				expect(blockchain.chain).toEqual(originalChain);
			});

			it('error mock is called',()=>{
				expect(errorMock).toHaveBeenCalled();
			});
		});

		describe('chain is longer',()=>{
			beforeEach(()=>{
				newChain.addBlock({data:'skr3'});
				newChain.addBlock({data:'skr0'});
				newChain.addBlock({data:'skr1'});
			});

			describe('chain is invalid',()=>{
				beforeEach(()=>{
					newChain.chain[2].hash='temp-hash';
					blockchain.replaceChain(newChain.chain);
				});

				it('does not replace the chain',()=>{
					expect(blockchain.chain).toEqual(originalChain);
				});

				it('error mock is called',()=>{
					expect(errorMock).toHaveBeenCalled();
				});
			});

			describe('chain is valid',()=>{
				beforeEach(()=>{
					blockchain.replaceChain(newChain.chain);
				});

				it('replaces the chain',()=>{
					expect(blockchain.chain).toEqual(newChain.chain);
				});

				it('log mock is called',()=>{
					expect(logMock).toHaveBeenCalled();
				});
			});
		});
	});
});