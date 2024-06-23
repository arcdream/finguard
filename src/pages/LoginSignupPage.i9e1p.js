import { user_login } from 'backend/login-signup-connector';
import { local } from 'wix-storage-frontend';
import StringConstants from 'public/common-strings';
import wixLocation from 'wix-location';
import { fetchAgentInfoBySupabaseId } from 'backend/agent-table-connector';
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
      if (response.status === StringConstants.SUCCESS) {
        handleSuccessfulLogin(response);
      } else {
        handleLoginFailure(response);
      }
    })
    .catch((error) => {
      console.log("Error in reading signin response:", error);
    });
}

function handleSuccessfulLogin(response) {
  const loginResponse = JSON.parse(response.message);
  const accessToken = loginResponse.access_token || null;
  const userId = loginResponse.id || null;

  local.setItem(StringConstants.JWT_TOKEN, accessToken);
  local.setItem(StringConstants.SUPABASE_USER_ID, userId);

  console.log("Session info stored:", local.getItem(StringConstants.JWT_TOKEN));
  console.log("Supabase user ID stored:", local.getItem(StringConstants.SUPABASE_USER_ID));

  getAgentInfoAndStore(userId, accessToken)
    .then(() => {
      console.log('Agent info successfully fetched and stored.');
      redirectToHomePage();
    })
    .catch(error => {
      console.error('Error handling agent info:', error);
    });
}

function handleLoginFailure(response) {
  if (response.message === StringConstants.INVALID_LOGIN_CREDENTIALS) {
    console.log("Invalid credentials");
    $w('#loginErrorDisplay').show();
    $w('#loginErrorDisplay').text = 'User or password is invalid';
  } else {
    local.setItem(StringConstants.JWT_TOKEN, null);
  }
}

function redirectToHomePage() {
  if (local.getItem(StringConstants.SESSION_AGENT_INFO) !== null) {
    wixLocation.to("/agent-home");
  } else {
    wixLocation.to("/");
  }
}

export function getAgentInfoAndStore(supabaseId, jwtToken) {
  return new Promise((resolve, reject) => {
    const agentFetchInputs = {
      supabaseId: supabaseId,
      accessJWTToken: jwtToken
    };

    console.log("Fetching agent info with inputs:", agentFetchInputs);

    fetchAgentInfoBySupabaseId(agentFetchInputs)
      .then(agentInfoResponse => {
        console.log("Agent info response received:", agentInfoResponse);

        if (agentInfoResponse.status === StringConstants.SUCCESS) {
          handleSuccessfulAgentFetch(agentInfoResponse, resolve);
        } else if (agentInfoResponse.message === StringConstants.JWT_EXPIRED) {
          wixLocation.to("/login-signup");
          reject(new Error('JWT expired'));
        } else {
          console.log("This is not an Agent login");
          local.setItem(StringConstants.SESSION_AGENT_INFO, null);
          resolve(null);
        }
      })
      .catch(error => {
        console.error('Error fetching agent info:', error);
        reject(error);
      });
  });
}

function handleSuccessfulAgentFetch(agentInfoResponse, resolve) {
  console.log("Successfully retrieved agent info");

  const agentInfoArray = JSON.parse(agentInfoResponse.message);
  console.log("Agent info array:", agentInfoArray);

  if (agentInfoArray.length > 0) {
    local.setItem(StringConstants.SESSION_AGENT_INFO, JSON.stringify(agentInfoArray[0]));
    console.log("Agent info stored successfully:", local.getItem(StringConstants.SESSION_AGENT_INFO));
    resolve(agentInfoArray[0]);
  } else {
    resolve(null);
  }
}


/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function signUpButton_click(event) {
	wixLocation.to("/singup-page");
}