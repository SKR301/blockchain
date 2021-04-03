import React, {Component} from 'react';
import ConductTransaction from '../components/ConductTransaction';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';

class App extends Component{

	render(){
		return (
			<div className='App'>
				<Profile />
				<ConductTransaction />
				<Navbar />
			</div>
		);
	}
}

export default App;