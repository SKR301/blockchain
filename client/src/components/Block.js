import React,{Component} from 'react';
import {Button} from 'react-bootstrap';
import Transaction from './Transaction';

class Block extends Component {
	state={displayTransaction:false};

	toggleTransaction=()=>{
		this.setState({displayTransaction:!this.state.displayTransaction});
	}

	get displayTransaction(){
		const {data} = this.props.block;

		const stringifiedData=JSON.stringify(data);

		const dataDisplay= stringifiedData.length > 35 ? 
							`${stringifiedData.substring(0,35)}...`:
							stringifiedData;

		if(this.state.displayTransaction){
			return (
				<div>
					{
						data.map(transaction=>(
							<div key={transaction.id}>
								<Transaction transaction={transaction}/>
							</div>
						))
					}	
					<br/>
					<Button className='mt-3 ml-5 p-2 font-15' bsStyle='danger' onClick={this.toggleTransaction}>
						Less...
					</Button>
				</div>
			)
		}		

		return(
			<div>
				<div>Data:{dataDisplay}</div>
				<Button className='mt-3 ml-5 p-2 font-15' bsStyle='primary' onClick={this.toggleTransaction}>
					More...
				</Button>
			</div>
		); 
	}

	render() {

		const {timestamp,hash} = this.props.block;

		const hashDisplay=`${hash.substring(0,15)}...`;
			
		return (
			<div className='Block'>
				<div className='card bg-light mt-3 w-50 mx-auto'>
					<div className='card-header text-primary font-25'>Hash: {hashDisplay}
						<span className='float-right text-secondary font-15 mt-5'>Timestamp: {new Date(timestamp).toLocaleString()}</span>
					</div>
					<div className='card-body text-dark'>
						<div className='card-text font-20'>{this.displayTransaction}</div>
					</div>
				</div>
			</div>
		);
	}
};

export default Block;