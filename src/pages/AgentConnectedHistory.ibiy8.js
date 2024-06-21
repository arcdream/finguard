import {local} from 'wix-storage-frontend';
import { fetch_user_subscribed_insurance } from 'backend/user_insurance_connector';
import wixWindowFrontend from "wix-window-frontend";
import { fetch_user_connected_agents } from 'backend/user_agent_connector_table_connector';
import { prepareAgentHistoryMenuItesm } from 'public/navigation-menu-manager';


$w.onReady( function() {
    console.log("Master Page is Loaded - user Dashboard -  2222222");

    console.log("session infor stored : ",  local.getItem('session-data'));
    
    $w('#topNavigationMenu').menuItems = prepareAgentHistoryMenuItesm();

    if (wixWindowFrontend.rendering.env === "browser") {
          console.log("Loaded data at browser");
          showUserConnectedToAgents();
    }

  } );


  export async function showUserConnectedToAgents() {
    const userInsuranceData = await fetch_AgentsConnectedByUser();

    if (userInsuranceData.success) {

      $w('#noAgentConnectHistorySection').collapse();
      $w('#noAgentConnectHistorySection').hide();

      const transformedData = userInsuranceData.data.map(( item, index )=> ({
        _id: index.toString(),
        agentId: item.agent_id.toString()
      }));

      $w("#agentConnectedHistoryRepeater").data = transformedData;
      $w("#agentConnectedHistoryRepeater").onItemReady(($item, itemData, index) => {
          $item("#agentIdDisplay").text = itemData.agentId;
          $item("#viewAgentDetailsButton").onClick(() => viewAgent_click($item, index));
        });

    } else {
      console.log("userInsuranceData not available");
    }

  }

  export async function fetch_AgentsConnectedByUser() {
    try {
        const data = await fetch_user_connected_agents(4);
        console.log('Agents Details for User Details:', data);
        return data;  
    } catch (error) {
        console.error('Error fetching insurance details:', error);
        throw error; 
    }
}

export async function viewAgent_click($item, index) {
	const selectedAgentId = $item("#agentId").text;
	console.log("Selected viewAgent : ", selectedAgentId);
}
  

  