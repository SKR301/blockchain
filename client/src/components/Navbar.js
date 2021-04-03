import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import {FormGroup,FormControl,Button,Form} from 'react-bootstrap';
import history from '../history';

class Navbar extends Component{

	render(){
		return (
			<div className='Navbar'>
				<Form inline className="pt-3 pl-5 pb-3 bg-dark">
					<div className='nav'>
						<FormGroup className="pt-2 pl-2">
							<Button
								className='cus-btn btn btn-outline-warning'
								href="/"
							>
								Home
							</Button>
						</FormGroup>
						<FormGroup className="pt-2 pl-2">
							<Button
								className='cus-btn btn btn-outline-warning'
								href="/blocks"
							>
								Blocks
							</Button>
						</FormGroup>
						<FormGroup className="pt-2 pl-2">
							<Button
								className='cus-btn btn btn-outline-warning'
								href="/transaction-pool"
							>
								Transaction
							</Button>
						</FormGroup>
					</div>
				</Form>
			</div>
		);
	}
};


export default Navbar;