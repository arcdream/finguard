import {local} from 'wix-storage-frontend';
import { fetch_user_subscribed_insurance } from 'backend/user_insurance_connector';
import wixWindowFrontend from "wix-window-frontend";
import { prepareUserPoliciesMenuItesm } from 'public/navigation-menu-manager';


$w.onReady( function() {
    console.log("Master Page is Loaded - user Dashboard");

    console.log("session infor stored : ",  local.getItem('session-data'));
    
    $w('#topNavigationMenu').menuItems = prepareUserPoliciesMenuItesm();

    if (wixWindowFrontend.rendering.env === "browser") {
          showInsuranceSubscribedDetails();
          console.log("Loaded data at browser");
    }

  } );


  export async function showInsuranceSubscribedDetails() {
    const userInsuranceData = await fetch_SubscriberInsuranceDetails();

    if (userInsuranceData.success) {
      const tableData = userInsuranceData.data.map(item => {
        return {
            "insurance": item.insurance_provider,          
            "premium": item.policy_number,
            "agent" : item.agent_id
        };
    });


    $w('#noIsuranceDisplaySection').collapse();
    $w('#noIsuranceDisplaySection').hide();
    $w('#insuranceDetailsTable').rows = tableData;


    } else {
      console.log("userInsuranceData not available");
    }

  }


  export async function fetch_SubscriberInsuranceDetails() {
    try {
        const data = await fetch_user_subscribed_insurance(4);
        //console.log('Insurance Details:', data);
        return data;  
    } catch (error) {
        //console.error('Error fetching insurance details:', error);
        throw error; 
    }
}

export async function viewAgent_click($item, index) {
	const selectedAgentId = $item("#agentId").text;
	console.log("Selected viewAgent : ", selectedAgentId);
}
  

  