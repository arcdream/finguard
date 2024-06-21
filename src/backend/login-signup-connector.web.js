import { Permissions, webMethod } from "wix-web-module";
import { sessionDataModel } from 'public/userSessionModel';
import wixSecretsBackend  from 'wix-secrets-backend';
import { get_supabase_client } from 'backend/utils/supabase-utils';
import StringConstants from 'public/common-strings';
import response from 'public/backend-response';


export const user_signup = webMethod(Permissions.Anyone, async (userSignUpInput) => {

  const response = {
    message: "",
    timestamo: new Date(),
    status: "failure"
  };
  
  console.log("Data at backend : ", userSignUpInput);
  const emailAddressForSignin = userSignUpInput.email_address;
  const passwordForSignin = userSignUpInput.password;

  console.log("email at back end : ", emailAddressForSignin);
  console.log("password at backend : ", passwordForSignin);

  if(emailAddressForSignin && passwordForSignin) {

    try {

      const supabase = await get_supabase_client().then(client => { return client; });

      const { user, error } = await supabase.auth.signUp(
        {
          email: emailAddressForSignin,
          password: passwordForSignin
        }
      );

      if(error) {
        response.message = error.message;
        response.status = "success";
        console.error('Signup error', error.message);
      } else {
        response.message = user;
        console.log("User signed up", user);
        response.status = StringConstants.SUCCESS;
      }

    } catch(error) {
      response.message = error;
      response.status = StringConstants.FAIL;
      console.error("Unexpected error: ", error);
    }


  } else {

    response.message = "Login created";
    response.status = "success"

    return response;

  }

  return response;
  
});

/********************************************************************************** 
 * User Login : Function to Login User
************************************************************************************/

export const user_login = webMethod(Permissions.Anyone, async (userLoginInput) => {
  const response = {
    message: "",
    timestamo: new Date(),
    status: "failure"
  };

  const { email_address, password } = userLoginInput;
  const supabase = await get_supabase_client();
  console.log("Supabase client initialized.");

  if (email_address && password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email_address, password });
      if (error) {
        response.message = error.message;
        response.status = StringConstants.FAIL;
        console.error('Login error ---> ', error.message);
      } else {
        console.log("Supabase Response of signInWithPassword : ", data);
        response.message = JSON.stringify(createSessionData(data));
        response.status = StringConstants.SUCCESS;
      }
    } catch (error) {
      response.message = error;
      response.status = StringConstants.FAIL;
      console.error("Unexpected error: ", error);
    }
  } else {
    response.message = StringConstants.MISSING_EMAIL_OR_PASSWORD;
    response.status = StringConstants.FAIL;
    response.message = "Email or Password is Missing";
  }

  return response;
});


export function createSessionData(data) {
  
	const sessionStore = {
		id: data.user?.id ?? '',
		email: data.user?.email ?? '',
		phone: data.user?.phone ?? '',
		access_token: data.session?.access_token ?? '',
	  };

	  validateSessionStore(sessionStore);
	  return sessionStore;
}

function validateSessionStore(sessionStore) {
	for (const key in sessionDataModel) {
		if (!sessionStore.hasOwnProperty(key)) {
		  return false;
		}
	  }
	  return true;
}

/********************************************************************
 *  Log out function
 *********************************************************************/

export const user_logout = webMethod(Permissions.Anyone, async () => {
  
  const logoutResponse = { ...response, timestamp: new Date() };

  try {
    console.log('Starting user logout process...');

    const supabase = await get_supabase_client();
    console.log("Supabase client initialized.");

    const { error } = await supabase.auth.signOut();

    if (error) {
      logoutResponse.message = error.message;
      logoutResponse.status = StringConstants.FAIL;
      console.error('Logout error:', error.message);
    } else {
      logoutResponse.message = "Logout successful";
      logoutResponse.status = StringConstants.SUCCESS;
      console.log("Logout was successful");
    }
  } catch (error) {
    logoutResponse.message = error.message || error;
    logoutResponse.status = StringConstants.FAIL;
    console.error("Unexpected error:", error);
  }

  console.log('User logout process completed.', logoutResponse);
  return logoutResponse;
});











