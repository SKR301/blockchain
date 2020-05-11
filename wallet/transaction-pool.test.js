const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool',()=>{
	let transactionPool,transaction,senderWallet;

	beforeEach(()=>{
		transactionPool = new TransactionPool();
		senderWallet=new Wallet();
		transaction = new Transaction({
			senderWallet,
			recipient:'fake-recipient',
			amount:50
		});
	});

	describe('set Transaction',()=>{
		it('adds transaction',()=>{
			transactionPool.setTransaction(transaction);

			expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
		});
	});	

	describe('existingTransaction()',()=>{
		it('returns traction given input address',()=>{
			transactionPool.setTransaction(transaction);

			expect(transactionPool.existingTransaction({
				inputAddress:senderWallet.publicKey
			}))
			.toBe(transaction);
		});
	});

	describe('validTransaction()',()=>{
		let validTransactions,errorMock;
		
		beforeEach(()=>{
			validTransactions = [];
			errorMock=jest.fn();
			global.console.error = errorMock;

			for(let a=0;a<10;a++){
				transaction=new Transaction({
					senderWallet,
					recipient:'any-recipient',
					amount:30
				});

				if(a%3===0){
					transaction.input.amount=999999;
				} else if(a%3===1){
					transaction.input.signature=new Wallet().sign('foo');
				} else {
					validTransactions.push(transaction);
				}

				transactionPool.setTransaction(transaction);
			}
		});

		it('returns valid transaction',()=>{
			expect(transactionPool.validTransactions()).toEqual(validTransactions);
		});

		it('logs error for invalid transactions',()=>{
			transactionPool.validTransactions();
			expect(errorMock).toHaveBeenCalled();
		});
	});

	describe('clear()',()=>{
		it('clears the transaction',()=>{
			transactionPool.clear();

			expect(transactionPool.transactionMap).toEqual({});
		});
	});

	describe('clearBlockchainTransaction()',()=>{
		it('clears transaction that are in pool',()=>{
			const blockchain = new Blockchain();
			const expectedTransactionMap = {};

			for(let a=0;a<6;a++){
				const transaction=new Wallet().createTransaction({
					recipient:'foo',
					amount:20
				});
				
				transactionPool.setTransaction(transaction);

				if(a%2==0){
					blockchain.addBlock({data:[transaction]});
				} else {
					expectedTransactionMap[transaction.id]=transaction;
				}
			}

			transactionPool.clearBlockchainTransactions({chain:blockchain.chain});

			expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
		});
	});
});