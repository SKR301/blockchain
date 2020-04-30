const Wallet=require('./index');
const {verifySignature}=require('../util');
const Transaction=require('./transaction');

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
				expect(()=>wallet.createTransaction({amount:999999,recipient:'foo-recipient'})).toThrow('Amount exceeds balance');
			});
		});

		describe('and amount is valid',()=>{
			let transaction,amount,recipient;

			beforeEach(()=>{
				amount=50;
				recipient='foo-recipient';
				transaction=wallet.createTransaction({amount,recipient});
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
	});
});