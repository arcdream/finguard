import {local} from 'wix-storage-frontend';
import { fetch_user_subscribed_insurance } from 'backend/user-insurance-connector';
import wixWindowFrontend from "wix-window-frontend";
import { prepareUserPoliciesMenuItesm } from 'public/navigation-menu-manager';
import StringConstants  from 'public/common-strings';
import { getSessionJWTToken } from 'public/session-manager';
import wixLocation from 'wix-location';


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

    try {

      const accessJWTToken =  getSessionJWTToken();
      const userId = "1";

      if(accessJWTToken == null) {
        wixLocation.to("/login-singup");
        return false;
      }

      const response = await fetch_user_subscribed_insurance( { userId, accessJWTToken });

      console.log("[ UserPolicies ]Amit user policies response received : ", response);

      if(response.status == StringConstants.FAIL) {
        if(response.message == StringConstants.JWT_EXPIRED) {
          wixLocation.to("/login-singup");
        }
      } else {

        let userPolicies = JSON.parse(response.message);

        if (Array.isArray(userPolicies) && userPolicies.length === 0) {
          console.log("[ UserPolicies ]No Policies is subscribed by User: ");
          $w('#showInsuranceDetails').collapse();
          $w('#showInsuranceDetails').hide();
          

        } else {
          const tableData = response.message.data.map(item => {
            return {
                "insurance": item.insurance_provider,          
                "premium": item.policy_number,
                "agent" : item.agent_id
            };
        });
        
        $w('#noIsuranceDisplaySection').collapse();
        $w('#noIsuranceDisplaySection').hide();
        $w('#insuranceDetailsTable').rows = tableData;
        }

      }

    } catch(error) {
      console.log('Error while fetching user insurance details : ', error);
    }



/*

    const userInsuranceData = await fetch_user_subscribed_insurance();

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

    */

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
  

  