import { registerAgent } from 'backend/agent-table-connector';
import { getSessionJWTToken, isSessionActive } from 'public/session-manager';
import wixLocation from 'wix-location';
import StringConstants from 'public/common-strings';



$w.onReady(function () {
    console.log("page loading done ...")
    $w('#section5').collapse();
    $w('#section5').hide();
    $w('#section4').expand();
    $w('#section4').show();
});


export function register_click(event) {
    console.log("Saving the data");

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
		validateEmptField($w('#firstName').value, "First Name Can not be Blank" ) &&
		validateEmptField($w('#firstName').value, "Last Name Can not be Blank" ) &&
		validateEmptField($w('#dateOfBirthPicker').value, "Date Of Birth Can not be Blank") &&
		validateEmptField($w('#homeAddress').value, "Home Addrss Can not be Blank") &&
		validateEmptField($w('#houseNumber').value, "House Number / Apartment name Can not be Blank") &&
		validateEmptField($w('#streetName').value, "Street Name Can not be Blank") &&
		validateEmptField($w('#gender').value, "Gender Can not be Blank" ) &&
		validateEmptField($w('#pinCode').value, "PinCode Can not be Blank") &&
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



