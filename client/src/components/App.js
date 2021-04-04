import React, {Component} from 'react';
import ConductTransaction from '../components/ConductTransaction';
import Profile from '../components/Profile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

class App extends Component{

	render(){
		return (
			<div className='App'>
				<Profile />
				<ConductTransaction />
				<Navbar />
				<Footer />
			</div>
		);
	}
}

export default App;