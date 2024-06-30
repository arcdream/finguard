import { registerAgent, updateAgentInformation } from 'backend/agent-table-connector';
import { getSessionJWTToken, getUserSupabaseId } from 'public/session-manager';
import StringConstants from 'public/common-strings';
import { local } from 'wix-storage-frontend';
import wixLocation from 'wix-location';
import { createBucketStorage } from 'backend/storage-connector';


const agentSessionInfo = local.getItem( StringConstants.SESSION_AGENT_INFO );
let agentProfilePage = 0;

$w.onReady( async function () {
    console.log("page loading done ...")

    if(agentProfilePage === 0) {
        $w('#thankYouMessageSection').collapse();
        $w('#thankYouMessageSection').hide();
        $w('#identityProofSection').collapse();
        $w('#identityProofSection').hide();
        $w('#basicInfoSection').expand();
        $w('#basicInfoSection').show();
    }

    if(agentProfilePage === 1) {
        $w('#basicInfoSection').collapse();
        $w('#basicInfoSection').hide();
        $w('#identityProofSection').expand();
        $w('#identityProofSection').show();
    }

    //console.log("[ AgentProfileCreator ] - Agent Supabase Id : ", getUserSupabaseId() );
    //console.log("[ AgentProfileCreator ] - Agent Session Info : ", agentSessionInfo);

    await handleAgentProfileStatus();
});


export function register_click(event) {
    console.log("Saving the data");
    uploadAadharFile()
    .then(() => console.log("--- Amit File Saved ---"))
    .catch(() => console.log("--- Amit File Saved Failed ---"));
   

}


async function uploadAadharFile() {
    try {
        const uploadedFiles = await $w("#uploadAadhar").uploadFiles();
        const uploadFileUrls = uploadedFiles.map(uploadedFile => uploadedFile.fileUrl);
        console.log("--- amit --- upload file url ::: ", uploadFileUrls);
        return uploadFileUrls;
    } catch (uploadError) {
        let errCode = uploadError.errorCode;  
        let errDesc = uploadError.errorDescription;
        console.error("Upload error:", errCode, errDesc);
        return ""; 
    }
}

function validateAadharNumber(aadhar_number) {
    const aadhar_number_validator_regex = /^\d{12}$/;
    
    if (aadhar_number_validator_regex.test(aadhar_number)) {
        return true;
    } else {
        $w('#errorMsgBox').text = 'provide a valid aadhar number';
        return false;
    }
}

function validateFileUploadButton(fileUploadHandler, errorMsg) {
	if (fileUploadHandler.length == 0) {
        $w('#errorMsgBox').text = errorMsg;
        return false;
    } else {
		return true;
	}
}

function validateEmptField(fieldName, errorMsg) {
        if (!fieldName) {
        $w('#errorMsgBox').text = errorMsg;
        return false;
    } else {
		return true;
	}
}

function validateBasicInfoForm() {
	console.log('[ AgentProfileCreator ] - validatin form fields');
	if( 
		validateEmptField($w('#firstNameInput').value, "First Name Can not be Blank" ) &&
		validateEmptField($w('#middleNameInput').value, "Last Name Can not be Blank" ) &&
		validateEmptField($w('#lastNameInput').value, "Last Name Can not be Blank" ) &&
		validateEmptField($w('#dateOfBirthPicker').value, "Date Of Birth Can not be Blank") &&
		validateEmptField($w('#homeAddressInput').value, "Home Addrss Can not be Blank") &&
		validateEmptField($w('#houseNumberInput').value, "House Number / Apartment name Can not be Blank") &&
		validateEmptField($w('#streetNameInput').value, "Street Name Can not be Blank") &&
		validateEmptField($w('#pinCodeInput').value, "PinCode Can not be Blank")
	  ) {
		return true;
	} else {
		return false;
	}
}

export function saveAndGotoNextPage_click(event) {

    if( validateBasicInfoForm() == false ) {
        console.log('[ AgentProfileCreator ] - form validation failed');
        return null;
    }

    const accessJWTToken = getSessionJWTToken();

    console.log("[ AgentProfileCreator ] - Agent Id : ", agentSessionInfo);

    var first_name = $w('#firstNameInput').value;
    var middle_name = $w('#middleNameInput').value;
    var last_name = $w('#lastNameInput').value;
    var date_of_birth = $w('#dateOfBirthPicker').value;
    var home_address = $w('#homeAddressInput').value;
    var house_number = $w('#houseNumberInput').value;
    var street_name = $w('#streetNameInput').value;
    var pin_code = $w('#pinCodeInput').value;


    let profileDataToInsert = {
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        date_of_birth: date_of_birth.toISOString().split('T')[0],
        house_address: house_number,
        street_name: street_name,
        pincode: parseInt(pin_code),
        address: JSON.stringify(home_address)
    };

    updateAgentInformation(profileDataToInsert, accessJWTToken, JSON.parse(agentSessionInfo).agent_id)
    .then((response ) => 
        { 
            handleBasicAgentInfoUpdateResponse(response);
        })
    .catch((error) => 
        { 
            console.error('[ AgentProfileCreator ] - Agent Profile update failed:', error);
            return false;
        });
}


export async function createAgentProfile(supabaseUserId) {
    const dataToInsert = {
      supa_user_id: supabaseUserId
    };
  
    try {
      const result = await registerAgent(dataToInsert, getSessionJWTToken());
      console.log('[ AgentProfileCreator ] - Agent Profile Created and session info stored :', result.message);
      local.setItem(StringConstants.SESSION_AGENT_INFO, result.message);
      return true;
    } catch (error) {
      console.error('[ AgentProfileCreator ] - Agent Profile Creation failed :', error);
      return false;
    }
  }

  export async function createStorage(agentId) {
    try {
      const result = await createBucketStorage('agent-' + agentId, getSessionJWTToken());
      console.log('[ AgentProfileCreator ] -Storage Creation Response :', result);
      return true;
    } catch (error) {
      console.error('[ AgentProfileCreator ] - Bucket Creation failed :', error);
      return false;
    }
  }
  

  export async function handleAgentProfileStatus() {

    let agentSessionInfo = local.getItem(StringConstants.SESSION_AGENT_INFO);

    console.log("[ AgentProfileCreator ] - agentSessionInfo : ", agentSessionInfo);

    if(agentSessionInfo == null) {
        //Agent is logging first time, so need to create an entry into agent table
        const agentProfileCreationResponse = await createAgentProfile( getUserSupabaseId() );
        //Agent is logging first time, so need to create a bucket for createStorageBucket
        if(agentProfileCreationResponse == true) {
            agentSessionInfo =  local.getItem( StringConstants.SESSION_AGENT_INFO );
            console.log('[ AgentProfileCreator ] - Agent Profile creation successfull with stored session info - ', agentSessionInfo);
            createStorage(JSON.parse(agentSessionInfo).agent_id);
        } else {
            console.log('[ AgentProfileCreator ] - Agent Profile Creation Failed');
        }

    } else {
        console.log("[ AgentProfileCreator ] - Agent Profile Already exists in Agent Table");
    }

  }

  export function handleBasicAgentInfoUpdateResponse( updateResponse ) {

    if(updateResponse.status == StringConstants.FAIL) {
        if(updateResponse.message == StringConstants.JWT_EXPIRED) {
            wixLocation.to("/login-singup");
        } else {
            console.log("[ AgentProfileCreator ] - Unknown error in saving profile data : ", updateResponse.message);
        }
    } 

    if(updateResponse.status == StringConstants.SUCCESS) {
        $w('#basicInfoSection').collapse();
        $w('#basicInfoSection').hide();
        $w('#identityProofSection').expand();
        $w('#identityProofSection').show();
        console.log("[ AgentProfileCreator ] - Agent Information updated Successfully");
    }

    if(updateResponse.state == StringConstants.FAIL) {
        console.log("[ AgentProfileCreator ] - Agent Information updated Failed");
    }

  }
  