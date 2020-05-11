const PubNub = require('pubnub');

const credentials = {
	publishKey: 'pub-c-c28065b6-91b0-4528-9d10-0afb541a3e2d',
	subscribeKey: 'sub-c-bac78b48-519e-11ea-b828-26d2a984a2e5',
	secretKey: 'sec-c-Mzk5OWQ2YjMtM2ExMy00ZmNlLTkzNmQtZThlYWMxYzE0NTgx'
};

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN',
	TRANSACTION:'TRANSACTION'
};

class PubSub {
	constructor({ blockchain , transactionPool, wallet }) {
		this.blockchain = blockchain;
		this.transactionPool=transactionPool;
		this.wallet=wallet;

		this.pubnub = new PubNub(credentials);

		this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });

		this.pubnub.addListener(this.listener());
	}

	broadcastChain() {
		this.publish({
			channel: CHANNELS.BLOCKCHAIN,
			message: JSON.stringify(this.blockchain.chain)
		});
	}

	broadcastTransaction(transaction){
		this.publish({
			channel:CHANNELS.TRANSACTION,
			message:JSON.stringify(transaction)
		});
	}

	listener() {
		return {
			message: messageObject => {
				const { channel, message } = messageObject;

				console.log(`Message received. Channel: ${channel}. Message: ${message}`);
				const parsedMessage = JSON.parse(message);

				switch(channel){
					case CHANNELS.BLOCKCHAIN:{
						this.blockchain.replaceChain(parsedMessage,true,()=>{
							this.transactionPool.clearBlockchainTransactions({chain:parsedMessage});
						});
						break;
					}
					case CHANNELS.TRANSACTION:{
						if(!this.transactionPool.existingTransaction({inputAddress:this.wallet.publicKey})){
							this.transactionPool.setTransaction(parsedMessage);
						}
						break;
					}
					default:{
						return;
					}
				}   
			}
		}
	}

	// publish({ channel, message }) {
	// 	this.pubnub.publish({ message, channel });
	// }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message}).then(result => {
          })
          .catch(error => {
            console.log(error);
          });
    }
}

module.exports = PubSub;