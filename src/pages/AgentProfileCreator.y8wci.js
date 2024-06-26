import { registerAgent, updateInsertAgent } from 'backend/agent-table-connector';
import { getSessionJWTToken, getUserSupabaseId } from 'public/session-manager';
import StringConstants from 'public/common-strings';
import { local } from 'wix-storage-frontend';


let agentProfileCreated = false;

$w.onReady( async function () {
    console.log("page loading done ...")
    $w('#thankYouMessageSection').collapse();
    $w('#thankYouMessageSection').hide();
    $w('#identityProofSection').collapse();
    $w('#identityProofSection').hide();
    $w('#basicInfoSection').expand();
    $w('#basicInfoSection').show();

    console.log("[ AgentProfileCreator ] - Agent Supabase Id : ", getUserSupabaseId() );

    await handleAgentProfileStatus();

});


export function register_click(event) {
    console.log("Saving the data");
/*
    if(isSessionActive() == false) {
        wixLocation.to("/login-singup");
        return false;
    }

    $w('#errorMsgBox').text = "";
    var first_name = $w('#firstName').value;
    var middle_name = $w('#input2').value;
    var last_name = $w('#input3').value;
    var date_of_birth = $w('#dateOfBirthPicker').value;
    var home_address = $w('#homeAddress').value;
    var house_number = $w('#houseNumber').value;
    var street_name = $w('#streetName').value;
    var gender = $w('#gender').value;
    var pin_code = $w('#pinCode').value;
    var aadhar_number = $w('#aadharNumber').value;

    const formValidationResult = true; //validateForm(); Amit temp commented

    if(formValidationResult == true) {

        console.log(gender);

        let dataToInsert = {
                first_name: first_name,
                middle_name: middle_name,
                last_name: last_name,
                date_of_birth: date_of_birth.toISOString().split('T')[0],
                house_address: house_number,
                street_name: street_name,
                pincode: parseInt(pin_code),
                address: home_address,
                gender: gender === "Male" ? 2 : 1,
                city: home_address.city,
                state : home_address.subdivision,
                latitude: home_address.location.latitude,
                longitude: home_address.location.longitude,
                country: home_address.country,
                aadhar_number: aadhar_number

        };

        const accessJWTToken =  getSessionJWTToken();
        registerAgent({ dataToInsert, accessJWTToken })
            .then(response => {
            
                if(response.message == StringConstants.JWT_EXPIRED){
                    
                    wixLocation.to("/login-singup");
                    return false;
                } 
                

                console.log("Agent Register Response : ", response);
                
            })
        .catch(error => {
                console.error('Error:', error); 
        });

        $w('#section4').collapse();
        $w('#section4').hide();
        $w('#section5').expand();
        $w('#section5').show();


    } else {
        console.log("Form data is not valid")
    }

    */
}


async function uploadAadharFile() {
    try {
        const uploadedFiles = await $w("#uploadAadhar").uploadFiles();
        const uploadFileUrls = uploadedFiles.map(uploadedFile => uploadedFile.fileUrl);
        return uploadFileUrls;
    } catch (uploadError) {
        let errCode = uploadError.errorCode;  
        let errDesc = uploadError.errorDescription;
        console.error("Upload error:", errCode, errDesc);
        return ""; 
    }
}


function validateForm() {
	console.log('validatin fields')
	if( 
		validateEmptField($w('#firstNameInput').value, "First Name Can not be Blank" ) &&
		validateEmptField($w('#firstNameInput').value, "Last Name Can not be Blank" ) &&
		validateEmptField($w('#dateOfBirthPicker').value, "Date Of Birth Can not be Blank") &&
		validateEmptField($w('#homeAddressInput').value, "Home Addrss Can not be Blank") &&
		validateEmptField($w('#houseNumberInput').value, "House Number / Apartment name Can not be Blank") &&
		validateEmptField($w('#streetNameInput').value, "Street Name Can not be Blank") &&
		validateEmptField($w('#gender').value, "Gender Can not be Blank" ) &&
		validateEmptField($w('#pinCodeInput').value, "PinCode Can not be Blank") &&
		validateFileUploadButton($w('#uploadAadhar').value, "Aadhar File is not selected") &&
        validateAadharNumber($w('#aadharNumber').value)
	  ) {
		return true;
	} else {
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

function validateAadharNumber(aadhar_number) {
    const aadhar_number_validator_regex = /^\d{12}$/;
    
    if (aadhar_number_validator_regex.test(aadhar_number)) {
        return true;
    } else {
        $w('#errorMsgBox').text = 'provide a valid aadhar number';
        return false;
    }
}

export function saveAndGotoNextPage_click(event) {

    const supabaseId = getUserSupabaseId();
    const accessJWTToken = getSessionJWTToken();

    console.log("[ AgentProfileCreator ] - Supabase User Id : ", supabaseId);

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
        address: home_address,
        supa_user_id : supabaseId
    };

    updateInsertAgent(profileDataToInsert, accessJWTToken)
    .then(result => 
        { 
            console.log(' [ AgentProfileCreator ] - Upsert successful:', result);
            return true;
        })
    .catch(error => 
        { 
            console.error('[ AgentProfileCreator ] - Upsert failed:', error);
            return false;
        });


}


export async function createAgentProfile(supabaseUserId) {
    const dataToInsert = {
      supa_user_id: supabaseUserId
    };
  
    try {
      const result = await registerAgent(dataToInsert, getSessionJWTToken());
      console.log('[ AgentProfileCreator ] - Agent Profile Creation initiated :', result);
      return true;
    } catch (error) {
      console.error('[ AgentProfileCreator ] - Agent Profile Creation failed :', error);
      return false;
    }
  }
  

  export async function handleAgentProfileStatus() {

    const agentSessionInfo = local.getItem(StringConstants.SESSION_AGENT_INFO);

    console.log("[ AgentProfileCreator ] - agentSessionInfo : ", agentSessionInfo);

    if(agentSessionInfo == null) {
        //Agent is logging first time, so need to create an entry into agent table
        createAgentProfile( getUserSupabaseId() );
    } else {
        console.log("[ AgentProfileCreator ] - Agent Profile Already exists in Agent Table");
    }

  }
  