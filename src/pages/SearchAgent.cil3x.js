import { fetch_agent_by_pincode } from 'backend/agent_table_connector';
import wixLocation from 'wix-location';
import {local} from 'wix-storage-frontend';


//Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
	console.log("Page Load is done")
	console.log("Amit is working in github ........")

	$w('#section5').hide()
	$w('#section5').collapse()
	$w('#agentDisplayRepeater').hide()
	$w('#agentDisplayRepeater').collapse()
});


/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export async function searchAgentButton_click(event) {

	console.log("searchAgentButton_click")

	console.log("Amit Fetching the session info", JSON.parse(local.getItem("cookie-session-data")).access_token);


	let pincode = $w('#pinCodeForSearchInput').value;

	
	const agentSearchResult = await agent_by_pincode(pincode, JSON.parse(local.getItem("cookie-session-data")).access_token);

	console.log("Result :", agentSearchResult);

	$w('#section5').show()
	$w('#section5').expand()
	$w('#section4').hide()
	$w('#section4').collapse()
	$w('#agentDisplayRepeater').show()
	$w('#agentDisplayRepeater').expand()


	if (agentSearchResult.data.length > 0) {

		const transformedData = agentSearchResult.data.map(( item, index )=> ({
			_id: index.toString(),
			name: item.first_name,
			agentId: item.agent_id.toString()
		}));
		console.log("Amit setting the result", transformedData)
        $w("#agentDisplayRepeater").data = transformedData;
        $w("#agentDisplayRepeater").onItemReady(($item, itemData, index) => {
            $item("#name").text = itemData.name;
            $item("#agentId").text = itemData.agentId;

			$item("#viewAgent").onClick(() => viewAgent_click($item, index));

        });
		console.log("Done setting values")
    } else {
        console.log('No data found');
        $w("#agentDisplayRepeater").data = [];
    }




}

export async function agent_by_pincode(pincode, jwtToken) {
    try {
		console.log("Amit jwt - 1", jwtToken)
        const data = await fetch_agent_by_pincode(parseInt(pincode, jwtToken));
        console.log('Promise resolved:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}


export function validate_pincode(pinCode) {
	const pincodeRegex = /^[1-9][0-9]{5}$/;

	if(pincodeRegex.test(pinCode)) {
		return true;
	} else {
		return false;
	}

}


export async function fetch_agent_info_for_user(agentId) {
    try {
        const data = await fetch_agent_by_pincode(parseInt(agentId));
        console.log('Agent Id Promise resolved:', data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}



export async function viewAgent_click($item, index) {
	
	const selectedAgentId = $item("#agentId").text;


	console.log("Selected viewAgent : ", selectedAgentId);

const data = {
      id: selectedAgentId
    };
    
    const queryString = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join("&");
    
    wixLocation.to(`/blank-4?${queryString}`);

}