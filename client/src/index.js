import React from 'react';
import {render} from 'react-dom';
import {Router,Switch,Route} from 'react-router-dom';
import history from './history';
import App from './components/App';
import Blocks from './components/Blocks';
import TransactionPool from './components/TransactionPool';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

render(
	<Router history={history}>
		<Switch>
			<Route exact path='/' component={App} />
			<Route path='/transaction-pool' component={TransactionPool} />
			<Route path='/blocks' component={Blocks} />
		</Switch>
	</Router>,
	document.getElementById('root')
);