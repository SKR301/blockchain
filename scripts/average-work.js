const Blockchain = require('../blockchain');
const blockchain=new Blockchain();

blockchain.addBlock({data:'initial'});

let prevtimestamp,nexttimestamp,timediff,avg,newblock;
const times=[];

for(a=0;a<1000;a++)
{
	prevtimestamp=blockchain.chain[blockchain.chain.length-1].timestamp;
	blockchain.addBlock({data:`block ${a}`});
	newblock=blockchain.chain[blockchain.chain.length-1];
	nexttimestamp=newblock.timestamp;
	timediff=nexttimestamp-prevtimestamp;
	times.push(timediff);
	avg=times.reduce((total,num)=>(total+num))/times.length;

	console.log('Time to mine:'+timediff+'ms. Difficulty:'+newblock.difficulty+'. Avg:'+avg);
}