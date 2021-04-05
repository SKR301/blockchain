import React,{Component} from 'react';
import {Button} from 'react-bootstrap';
import Transaction from './Transaction';
import {Link} from 'react-router-dom';
import history from '../history';
import App from '../components/App';

const POLL_INTERVAL_MS=10000;

class TransactionPool extends Component{
	state={transactionPoolMap:{}};

	fetchTransactionPoolMap=()=>{
		fetch(`${document.location.origin}/api/transaction-pool-map`)
		.then(response=>response.json())
		.then(json=>this.setState({transactionPoolMap:json}));	
	}

	fetchMineTransactions=()=>{
		fetch(`${document.location.origin}/api/mine-transactions`)
		.then(response=>{
			if(response.status===200){
				alert('success');
				history.push('/blocks');
			} else {
				alert('block request did not complete');
			}
		});
	}

	componentDidMount(){
		this.fetchTransactionPoolMap();

		this.fetchPoolMapInterval=setInterval(()=>this.fetchTransactionPoolMap,POLL_INTERVAL_MS);
	}

	componentWillUnmount(){
		clearInterval(this.fetchPoolMapInterval	);
	}

	render(){
		return (
			<div className='TransactionPool'>
			<App />
				<div className='mt-3 w-50 mx-auto'>
					<div className='display-3 text-center text-primary'>TransactionPool</div>

					<Button
						className='mt-3 p-2 font-15 float-right'
						bsStyle='danger'
						onClick={this.fetchMineTransactions}
					>	
						Mine Transactions
					</Button>

					<div className='pool'>
						{
							Object.values(this.state.transactionPoolMap).map(transaction=>{
								return (
									<div className='font-20' key={transaction.id}>
										<Transaction transaction={transaction}/>
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
};	

export default TransactionPool;