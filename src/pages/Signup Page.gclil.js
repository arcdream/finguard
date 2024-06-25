import { user_signup } from 'backend/login-signup-connector'
import StringConstants from 'public/common-strings';
import wixLocation from 'wix-location';
import { prepareSignupPageMenuItems } from 'public/navigation-menu-manager';
import { showMessageBox } from 'public/lightbox-utils';

let userRoleType = null;

$w.onReady(function () {
	console.log("Signup Page is Loaded");
    $w('#topNavigationMenu').menuItems = prepareSignupPageMenuItems();
	userRoleType = wixLocation.query.role;
	console.log("[Signup Page] - user type : ", userRoleType );
});


export function singupUserButton_click(event) {

	console.log("Signup the new user")
	$w("#signupErrorMsg").collapse();
	$w("#signupErrorMsg").hide();

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
		password: password,
		userRole : userRoleType
	};
	console.log("singin data", signinData);

	user_signup(signinData)
	.then((response) => {
		console.log("response from backend singing : ", response);

		if(response.status == StringConstants.FAIL) {
			console.log("Error in signup with supabase");
			$w("#signupErrorMsg").expand();
			$w("#signupErrorMsg").show();
			$w("#signupErrorMsg").text = response.message;

			if (response.message === StringConstants.USER_ALREADY_EXISTS) {
				console.log(StringConstants.USER_ALREADY_EXISTS);
				showMessageBox(StringConstants.USER_ALREADY_EXISTS);
				wixLocation.to('/login-singup');
			} 

		} else {
			console.log("Successfully signup with supabase");
			wixLocation.to("/login-singup");
			
		}

	})
	.catch((error) => {
		console.log("error in reading singin response", error)
	});

}



