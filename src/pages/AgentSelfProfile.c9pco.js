import { read_agent_self_info } from 'backend/agent_table_connector';

$w.onReady(function () {
	console.log("Page Load is done");
    load_agent_info(1008);
});



export function load_agent_info(agentId) {
	read_agent_self_info(agentId)
		.then((agentInformation) => {
    		console.log('Promise resolved:', agentInformation);
			displayProfile(agentInformation.data);
		}).catch((error) => {
    		console.error('Error:', error);
		});
}

export function displayProfile(agentInformation) {

	$w('#agentNameDisp').text = agentInformation[0].first_name + ' ' + agentInformation[0].middle_name + ' ' + agentInformation[0].last_name;
	$w('#agentIdDisp').text = agentInformation[0].agent_id;
	$w('#statusDisp').text = 'active';
	$w('#experinceDisp').text = 20 + ' Years';
	$w('#aadharDisp').text = agentInformation[0].aadhar_number;

	let Address = agentInformation[0].house_address + '\n' + agentInformation[0].street_name + '\n' 
	+ agentInformation[0].city + ' ' 
	+ agentInformation[0].state + ' ' 
	+ agentInformation[0].pincode;

	$w('#addressDisp').text = Address;
}
