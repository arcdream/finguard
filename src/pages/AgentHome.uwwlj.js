import { fetchUserConnectHistory } from 'backend/user_agent_connector_table_connector'
import { local } from "wix-storage-frontend";
import StringConstants  from 'public/common-strings';
import wixLocation from 'wix-location';
import { fetchAgentInfoBySupabaseId } from 'backend/agent-table-connector';

$w.onReady(function () {

	console.log("Agent Home Page Loaded ...");
	const accessToken = local.getItem(StringConstants.JWT_TOKEN);
	const userId = local.getItem(StringConstants.SUPABASE_USER_ID); 

	getBasicAgentInformation(userId, accessToken)
    .then((agentInfo) => {
      	console.log('[ AgentHome ] - Basic agent information fetched from DB. :', agentInfo);
		  handleSuccessfulAgentFetch(agentInfo);
		  //fetchUserAgentConnectionLog(1008, accessToken); Amit .. take a look
    })
    .catch(error => {
      console.error('[ AgentHome ] - Error handling agent info:', error);
    });

});

export async function getBasicAgentInformation(supabaseId, jwtToken) {
	return new Promise((resolve, reject) => {
	  const agentFetchInputs = {
		supabaseId: supabaseId,
		accessJWTToken: jwtToken
	  };
  
	  console.log("[ AgentHome ] - Fetching agent info with inputs:", agentFetchInputs);
  
	  fetchAgentInfoBySupabaseId(agentFetchInputs)
		.then(agentInfoResponse => {
		  console.log("[ AgentHome ] - Agent info response received:", agentInfoResponse);
		  if (agentInfoResponse.status === StringConstants.SUCCESS) {
			const agentInfoArray = JSON.parse(agentInfoResponse.message);
			resolve(agentInfoArray);
		  } else if (agentInfoResponse.message === StringConstants.JWT_EXPIRED) {
			wixLocation.to("/login-signup");
			reject(new Error('JWT expired'));
		  } else {
				resolve(null);
		  }
		})
		.catch(error => {
		  console.error('Error fetching agent info:', error);
		  reject(error);
		});
	});
}


function handleSuccessfulAgentFetch(agentInfo) {
	if (agentInfo) {
	  local.setItem(StringConstants.SESSION_AGENT_INFO, agentInfo);
	  console.log("Agent info stored successfully:", local.getItem(StringConstants.SESSION_AGENT_INFO));
	} else {
		local.removeItem(StringConstants.SESSION_AGENT_INFO);
		wixLocation.to('/agent-profile-creator');
	}
}


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
		local.removeItem(StringConstants.SESSION_AGENT_INFO);
	  }
}

