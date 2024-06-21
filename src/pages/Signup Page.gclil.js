import { user_signup } from 'backend/login_signup_connector'

$w.onReady(function () {

	$w('#updateUserProfileSection').collapse();
	$w('#updateUserProfileSection').hide();

});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function singupUserButton_click(event) {

	console.log("Signup the new user")

	const emailAddress = $w('#emailAddressForSignup').value;
	const password = $w('#passwordForSignup').value;
	const confirmPassword = $w('#confirmPasswordSignup').value;

	if(password != confirmPassword) {
		$w("#signupErrorMsg").expand();
		$w("#signupErrorMsg").show();
		$w("#signupErrorMsg").text = "Password does not match";

		console.log("Password does not match")

		return;
	}

	console.log("All fields are valid, requesting the signup")


	let signinData = {
		email_address: emailAddress,
		password: password
	};
	console.log("singin data", signinData);

	user_signup(signinData)
	.then((response) => {
		console.log("response from backend singing : ", response);

		$w('#updateUserProfileSection').expand();
		$w('#updateUserProfileSection').show();
	})
	.catch((error) => {
		console.log("error in reading singin response")
	});

}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function updateUserProfileButton_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function text19_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
}

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function skipUpdateUserProfileText_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
}