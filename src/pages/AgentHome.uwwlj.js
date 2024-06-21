import { fetchUserConnectHistory } from 'backend/user_agent_connector_table_connector'
import { local } from "wix-storage-frontend";
import StringConstants  from 'public/common-strings';
import wixLocation from 'wix-location';

$w.onReady(function () {

	console.log("Agent Home Page Loaded ...");
	const accessToken = local.getItem(StringConstants.JWT_TOKEN);
	fetchUserAgentConnectionLog(1008, accessToken);

});


export async function fetchUserAgentConnectionLog(agentId, accessToken) {

	const agentFetchInputs = {
		agentId: agentId,
		accessToken: accessToken
	  };

	const response = await fetchUserConnectHistory(agentFetchInputs);

	if(response.status == StringConstants.SUCCESS) {
		console.log("Successfully retrieved agent Info");
		const userAgentConnectHistoryLogs = JSON.parse(response.message);
		console.log("Agent Info Contact Histroy : ", userAgentConnectHistoryLogs);

		const tableData = userAgentConnectHistoryLogs.map(item => {
			  return {
				  "user_id": item.user_id,          
				  "connectTime": item.created_at,
				  "status" : item.connect_request_status
			  };
		});

		  $w('#userConnectHistoryLogs').rows = tableData;

	  } else if (response.message ==StringConstants.JWT_EXPIRED) {
		wixLocation.to("/login-singup");
	  } else {
		console.log("This is not an Agent login")
		local.setItem(StringConstants.SESSION_AGENT_INFO, null);
	  }
}

