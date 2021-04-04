import React,{Component} from 'react';

class Footer extends Component{

	render(){
		return (
			<div className='Footer'>
				<div className='bg-light fixed-bottom pl-5 pt-1 text-secondary'>
					<div className='d-inline font-15'>SS Enterprises©</div>
					<p>estd. 2021</p>
				</div>
			</div>
		);
	}
};


export default Footer;