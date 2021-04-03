import React, {Component} from 'react';
import logo from '../assets/logo.png';

class Profile extends Component{

	state={walletInfo:{}};

	componentDidMount(){
		fetch(`${document.location.origin}/api/wallet-info`)
		.then(response=>response.json())
		.then(json=>this.setState({walletInfo:json}));
	}


	render(){

		const {address,balance}=this.state.walletInfo;
		return (
			<div className='Profile'>
				<div className='profile p-5 bg-dark'>
					<img className='rounded-circle mx-auto d-block' src={logo}></img>
					<div className='text-center'>
						<h1 className='text-light mt-5'>Balance:</h1>
						<h1 className='display-3 text-light font-weight-normal'> {balance}</h1>
						<h3 className='font-italic text-warning mt-3'>Address: </h3>
						<h3 className='font-italic text-warning text-truncate'>{address}</h3>
					</div>
				</div>
			</div>
		);
	}
}

export default Profile;