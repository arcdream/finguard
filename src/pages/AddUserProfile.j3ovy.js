// Velo API Reference: https://www.wix.com/velo/reference/api-overview/introduction

import { submit_user_profile } from 'backend/user_table_connector.web.js'


$w.onReady(function () {

	// Write your Javascript code here using the Velo framework API

	// Print hello world:
	// console.log("Hello world!");

	// Call functions on page elements, e.g.:
	// $w("#button1").label = "Click me!";

	// Click "Run", or Preview your site, to execute your code

	$w('#errorMessage').hide();

});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function submitUserProfile_click(event) {

	console.log("Submitting user Profile Info");
	$w('#errorMessage').text = "";

	if(validateForm) {

		let dataToInsert = {
			first_name: $w('#firstName').value,
			middle_name: $w('#middleName').value,
			last_name: $w('#lastName').value,
			date_of_birth: $w('#dateOfBirth').value.toISOString().split('T')[0],
			gender: $w('#gender').value == "Male" ? 2 : 1
		};

		submit_user_profile(dataToInsert);
	}

}

function validateForm() {
	console.log('form validation');

	if(
		validateEmptyField($w('#firstName').value, "First Name can not be blank") &&
		validateEmptyField($w('#lastName').valid, "Last Name can not be blank") &&
		validateEmptyField($w('#dateOfBirth').value, "Date of Birth Can not be blank") &&
		validateEmptyField($w('#gender').value, "Gender can not be blank")
	) {
		return true;
	} else {
		return false;
	}

}


function validateEmptyField(fieldName, errorMessage) {
	if(!fieldName) {
		$w('#errorMessage').text = errorMessage;
		return false;
	} else {
		return true;
	}
}

