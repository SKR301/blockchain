import React ,{Component} from 'react';
import Block from './Block';
import {Link} from 'react-router-dom';
import App from '../components/App';

class Blocks extends Component{
	state={blocks:[]};

	componentDidMount(){
		fetch(`${document.location.origin}/api/blocks`)
		.then(response=>response.json())
		.then(json=>this.setState({blocks:json}));
	}

	render(){
		console.log('this.state',this.state);

		return (
			<div>
				<App />

				<div classname='Blocks'>
					<h3>Blocks</h3>
					{
						this.state.blocks.map(block=>{
							return(
								<Block key={block.hash} block={block}/>
							);
						})
					}
				</div>
			</div>
		);
	}
}

export default Blocks;