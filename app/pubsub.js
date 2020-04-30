const PubNub = require('pubnub');

const credentials = {
	publishKey: 'pub-c-ec30f7ec-578f-4aa2-81c8-59077fb942c4',
	subscribeKey: 'sub-c-eda4e664-027b-11e9-a39c-e60c31199fb2',
	secretKey: 'sec-c-OWQwMTg1MGMtY2U2YS00ZmVlLWE1YmEtOTVmMWZmN2ZiOWVm'
};

const CHANNELS = {
	TEST: 'TEST',
	BLOCKCHAIN: 'BLOCKCHAIN',
	TRANSACTION:'TRANSACTION'
};

class PubSub {
	constructor({ blockchain , transactionPool }) {
		this.blockchain = blockchain;
		this.transactionPool=transactionPool;
		this.pubnub = new PubNub(credentials);

		this.pubnub.subscribe({ channels: Object.values(CHANNELS) });

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
						this.blockchain.replaceChain(parsedMessage);
						break;
					}
					case CHANNELS.TRANSACTION:{
						this.transactionPool.setTransaction(parsedMessage);
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
	// 	console.log(message+"%%%%%%%%%%%"+channel);
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