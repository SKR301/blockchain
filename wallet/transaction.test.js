const Transaction = require('./transaction');
const Wallet=require('./index');
const {verifySignature}=require('../util/');

describe('Transaction',()=>{
	let transaction,senderWallet,recipient,amount;

	beforeEach(()=>{
		senderWallet=new Wallet();
		recipient='recipient-public-key';
		amount=301;

		transaction=new Transaction({senderWallet,recipient,amount});
	});

	it('has an `id`',()=>{
		expect(transaction).toHaveProperty('id');
	});

	describe('OutputMap',()=>{
		it('has an `outputMap`',()=>{
			expect(transaction).toHaveProperty('outputMap');
		});

		it('outputs the amount to recipient',()=>{
			expect(transaction.outputMap[recipient]).toEqual(amount);
		});
		
		it('outputs the balance to `senderWallet`',()=>{
			expect(transaction.outputMap[senderWallet.publicKey]).toEqual(senderWallet.balance-amount);
		});
	});

	describe('input',()=>{
		it('has an `input`',()=>{
			expect(transaction).toHaveProperty('input');
		});

		it('has an `timestamp` in input',()=>{
			expect(transaction.input).toHaveProperty('timestamp');
		});

		it('sets `amounts` to `sender wallet`',()=>{
			expect(transaction.input.amount).toEqual(senderWallet.balance);
		});

		it('sets `address` to `sender wallet` public key',()=>{
			expect(transaction.input.address).toEqual(senderWallet.publicKey);
		});

		it('signs the input',()=>{
			expect(
				verifySignature({
					publicKey:senderWallet.publicKey,
					data:transaction.outputMap,
					signature:transaction.input.signature
				})
			).toBe(true);
		});
	});

	describe('Validate transaction',()=>{
		let errorMock;

		beforeEach(()=>{
			errorMock=jest.fn();
			global.console.error=errorMock;
		})

		describe('Transaction is valid',()=>{
			it('returns true',()=>{
				expect(Transaction.validTransaction(transaction)).toBe(true);
			});
		});

		describe('Transaction is invalid',()=>{
			describe('and outputMap is invalid',()=>{
				it('returns false and logs error',()=>{
					transaction.outputMap[senderWallet.publicKey]=99999999;

					expect(Transaction.validTransaction(transaction)).toBe(false);
					expect(errorMock).toHaveBeenCalled();
				});
			});

			describe('and Signature is invalid',()=>{
				it('returns false and logs error',()=>{
					transaction.input.signature=new Wallet().sign('data');
					
					expect(Transaction.validTransaction(transaction)).toBe(false);
					expect(errorMock).toHaveBeenCalled();
				});
			});			
		});
	});

	describe('update()',()=>{
		let originalSignature,nextRecipient,nextAmount,originalSenderOutput;
		
		describe('and the amount is invalid',()=>{
			it('throws an error',()=>{
				expect(()=>{transaction.update({senderWallet,recipient:'foo',amount:999999})}).toThrow('Amount exceeds balance');
			});
		});

		describe('and the amount is valid',()=>{
			beforeEach(()=>{
				originalSignature=transaction.input.signature;
				nextRecipient='next-recipient';
				nextAmount=50;
				originalSenderOutput=transaction.outputMap[senderWallet.publicKey];

				transaction.update({senderWallet,recipient:nextRecipient,amount:nextAmount});
			});

			it('Outputs amount to next recipient',()=>{
				expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
			});

			it('Subtracts amount from original sender wallet',()=>{
				expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput-nextAmount);
			});

			it('maintain total output that matches input amount',()=>{
				expect(Object.values(transaction.outputMap).reduce((total,outputAmount)=>total+outputAmount)).toEqual(transaction.input.amount)
			});

			it('re-signs the transaction',()=>{
				expect(transaction.input.signature).not.toEqual(originalSignature);
			});

			describe('another update for same recipient',()=>{
				let addedAmount;

				beforeEach(()=>{
					addedAmount=80;
					transaction.update({senderWallet,recipient:nextRecipient,amount:addedAmount});
				});

				it('adds to the recipient',()=>{
					expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount+addedAmount);
				});

				it('subtracts from the sender',()=>{
					expect(transaction.outputMap[senderWallet.publicKey]).toEqual(originalSenderOutput-nextAmount-addedAmount);
				});


			});
		});	

	});
});