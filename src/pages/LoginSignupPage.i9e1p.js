import { user_login } from 'backend/login-signup-connector';
import { local } from 'wix-storage-frontend';
import StringConstants from 'public/common-strings';
import wixLocation from 'wix-location';
import { clearSession } from 'public/session-manager';

$w.onReady(function () {
  $w('#loginErrorDisplay').hide();
  clearSession();
  console.log("Login and Signup page is loaded");
});

export function signinButton_click(event) {
  $w('#loginErrorDisplay').hide();
  let signinData = {
    email_address: $w('#signinEmailInput').value,
    password: $w('#signinPasswordInput').value
  };
  console.log("Signing in with data:", signinData);

  user_login(signinData)
    .then((response) => {
      console.log('[ LoginSignupPage ] - Login Response : ', response)
      if (response.status === StringConstants.SUCCESS) {
        handleSuccessfulLogin(response);
      } else {
        handleLoginFailure(response);
      }
    })
    .catch((error) => {
      console.log("[ LoginSingupPage ] - Error in reading signin response:", error);
    });
}

function handleSuccessfulLogin(response) {
  const loginResponse = JSON.parse(response.message);
  const accessToken = loginResponse.access_token || null;
  const userId = loginResponse.id || null;

  local.setItem(StringConstants.JWT_TOKEN, accessToken);
  local.setItem(StringConstants.SUPABASE_USER_ID, userId);
  local.setItem(StringConstants.AGENT_PROFILE_STATUS, loginResponse.agentProfileStatus);

  console.log("Session info stored:", local.getItem(StringConstants.JWT_TOKEN));
  console.log("Supabase user ID stored:", local.getItem(StringConstants.SUPABASE_USER_ID));

  if(loginResponse.userRole == StringConstants.USER_ROLE_AGENT) {
    wixLocation.to("/agent-home");
  } else {
    wixLocation.to("/");
  }

}

function handleLoginFailure(response) {
    console.log("[ LoginSignupPage ] - Error in Login : ", response.message);
    $w('#loginErrorDisplay').show();
    $w('#loginErrorDisplay').text = response.message;
    local.setItem(StringConstants.JWT_TOKEN, null);
}



export function signUpButton_click(event) {
	wixLocation.to("/singup-page?role=" + StringConstants.USER_ROLE_CLIENT);
}


export function signUpAsAgentButton_click(event) {
	wixLocation.to("/singup-page?role=" + StringConstants.USER_ROLE_AGENT);
}