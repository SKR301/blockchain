import React from 'react';

const Transaction = ({transaction}) =>{
	const {input,outputMap} = transaction;
	const recipients=Object.keys(outputMap);

	return (
		<div className='Transaction mt-2'>
			<div className='container border border-primary rounded'>
				<div className='row'>
					<div className='col-2'>From: </div>
					<div className='col-6'>{`${input.address.substring(0,25)}...`}</div>
					<div className='col-2'>Balance: </div>
					<div className='col-2 font-weight-bold text-danger'>{input.amount}</div>
				</div>

				{
					recipients.map(recipient=>(
						<div className='row' key={recipient}>
							<div className='col-2'>To:</div> 
							<div className='col-6'>{`${recipient.substring(0,25)}...`}</div>
							<div className='col-2'>Sent: </div>
							<div className='col-2 font-weight-bold text-success'>{outputMap[recipient]}</div>
						</div>
					))
				}	
			</div>
		</div>
	);
}

export default Transaction;	