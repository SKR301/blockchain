const Wallet=require('./index');
const {verifySignature}=require('../util');
const Transaction=require('./transaction');
const Blockchain = require('../blockchain');
const {STARTING_BALANCE}=require('../config');

describe('Wallet',()=>{
	let wallet;

	beforeEach(()=>{
		wallet=new Wallet();
	});

	it('has a `balance`',()=>{
		expect(wallet).toHaveProperty('balance');
	});

	it('has a `publicKey`',()=>{
		expect(wallet).toHaveProperty('publicKey');
	});


	describe('Signing data',()=>{
		const data='data';

		it('Verifies a signature',()=>{
			expect(
				verifySignature({
					publicKey:wallet.publicKey,
					data:data,
					signature:wallet.sign(data)
				})
			).toBe(true);
			
		});

		it('Doesnt verifies a signature',()=>{
			expect(
				verifySignature({
					publicKey:wallet.publicKey,
					data:data,
					signature:new Wallet().sign(data)
				})
			).toBe(false);
		});
	});

	describe('createTransaction()',()=>{
		describe('and amount exceeds',()=>{
			it('throws an error',()=>{
				expect(()=>wallet.createTransaction({
					amount:999999,
					recipient:'foo-recipient'
				}))
				.toThrow('Amount exceeds balance');
			});
		});

		describe('and amount is valid',()=>{
			let transaction,amount,recipient;

			beforeEach(()=>{
				amount=50;
				recipient='foo-recipient';
				transaction=wallet.createTransaction({
								amount,
								recipient
							});
			});
			it('Create instance of `Transactions`',()=>{
				expect(transaction instanceof Transaction).toBe(true);
			});

			it('Matches the transaction amount with wallet',()=>{
				expect(transaction.input.address).toEqual(wallet.publicKey);
			});

			it('Outputs amout to recipient',()=>{
				expect(transaction.outputMap[recipient]).toEqual(amount); 
			});
		});

		describe('and the chain is passed',()=>{
			it('calls `Wallet.calculateBalance()`',()=>{
				const calculateBalanceMock=jest.fn();
				const originalCalculateBalance=Wallet.calculateBalance;
				Wallet.calculateBalance=calculateBalanceMock;

				wallet.createTransaction({
					recipient:'fake-recipient',
					amount:10,
					chain:new Blockchain().chain
				});

				expect(calculateBalanceMock).toHaveBeenCalled();

				Wallet.calculateBalance=originalCalculateBalance;
			});
		});
	});

	describe('calculateBalance()',()=>{
		let blockchain;

		beforeEach(()=>{
			blockchain=new Blockchain();
		});

		describe('there are no outputs',()=>{
			it('returns the `STARTING_BALANCE`',()=>{
				expect(Wallet.calculateBalance({
					chain:blockchain.chain,
					address:wallet.publicKey
				}))
				.toEqual(STARTING_BALANCE);
			});
		});

		describe('there are outputs',()=>{
			let transactionOne,transactionTwo;

			beforeEach(()=>{
				transactionOne=new Wallet().createTransaction({
					recipient:wallet.publicKey,
					amount:50
				});

				transactionTwo=new Wallet().createTransaction({
					recipient:wallet.publicKey,
					amount:100
				});

				blockchain.addBlock({data:[transactionOne,transactionTwo]});
			});	

			it('adds the sum of all outputs to the wallet balance',()=>{
				expect(Wallet.calculateBalance({
					chain:blockchain.chain,
					address:wallet.publicKey
				}))
				.toEqual(STARTING_BALANCE
							+transactionOne.outputMap[wallet.publicKey]
							+transactionTwo.outputMap[wallet.publicKey]
						);
			});

			describe('and the wallet has made transaction',()=>{
				let recentTransaction;

				beforeEach(()=>{
					recentTransaction=wallet.createTransaction({
						recipient:'foo-recipient',
						amount:30
					});
					blockchain.addBlock({data:[recentTransaction]});
				});

				it('returns output of recent Transaction',()=>{
					expect(Wallet.calculateBalance({
						chain:blockchain.chain,
						address:wallet.publicKey
					}))
					.toEqual(recentTransaction.outputMap[wallet.publicKey]);
				});

				describe('and there are outputs next to and after recent transaction',()=>{
					let sameBlockTransaction,nextBlockTransaction;

					beforeEach(()=>{
						recentTransaction=wallet.createTransaction({
							recipient:'later-foo-address',
							amount:60
						});

						sameBlockTransaction=Transaction.rewardTransaction({minerWallet:wallet});

						blockchain.addBlock({data:[recentTransaction,sameBlockTransaction]});

						nextBlockTransaction=new Wallet().createTransaction({
							recipient:wallet.publicKey,
							amount:75
						});

						blockchain.addBlock({data:[nextBlockTransaction]});
					});

					it('includes output amount in returned balance',()=>{
						expect(Wallet.calculateBalance({
							chain:blockchain.chain,
							address:wallet.publicKey
						}))
						.toEqual(recentTransaction.outputMap[wallet.publicKey]
							+sameBlockTransaction.outputMap[wallet.publicKey]
							+nextBlockTransaction.outputMap[wallet.publicKey]
						);
					});
				});
			});
		});
	});
});