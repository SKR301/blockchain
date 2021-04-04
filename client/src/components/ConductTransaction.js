import React,{Component} from 'react';
import {FormGroup,FormControl,Button,Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import history from '../history';

class ConductTransaction extends Component{
	state={recipient:'',amount:0};

	updateRecipient=event=>{
		this.setState({recipient:event.target.value});
	}
	
	updateAmount=event=>{
		this.setState({amount:Number(event.target.value)});
	}

	ConductTransaction=()=>{
		const {recipient,amount}=this.state;

		fetch(`${document.location.origin}/api/transact`,{
			method:'POST',
			headers:{'Content-type':'application/json'},
			body:JSON.stringify({recipient,amount})
		})
		.then(response=>response.json())
		.then(json=>{
			alert(json.message||json.type);
			this.setState({recipient:'',amount:'0'});
			history.push('/transaction-pool');	
			window.location.reload();
		});
	}

	render(){
		return (
			<div className='ConductTransaction'>
				<Form inline className="p-3 bg-light fixed-top">

					<FormGroup className='recipient'>
						<FormControl
							input='text'
							size='small'
							placeholder='recipient'
							value={this.state.recipient}
							onChange={this.updateRecipient}
						/>
					</FormGroup>

					<FormGroup className="pl-2">
						<FormControl
							input='number'
							placeholder='amount'
							value={this.state.amount}
							onChange={this.updateAmount}
						/>
					</FormGroup>

					<div>
						<FormGroup className="pl-2">
							<Button
								bsStyle='success'
								className='font-20'
								onClick={this.ConductTransaction}
							>
								Send
							</Button>
						</FormGroup>
					</div>
				</Form>
			</div>
		)
	}
};

export default ConductTransaction;