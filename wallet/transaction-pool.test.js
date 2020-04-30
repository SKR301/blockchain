const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool',()=>{
	let transactionPool,transaction,senderWallet;

	beforeEach(()=>{
		transactionPool = new TransactionPool();
		senderWallet=new Wallet();
		transaction = new Transaction({senderWallet,recipient:'fake-recipient',amount:50});
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

			expect(transactionPool.existingTransaction({inputAddress:senderWallet.publicKey})).toBe(transaction);
		});
	});
});