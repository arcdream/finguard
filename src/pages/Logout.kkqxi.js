import { user_logout } from 'backend/login-signup-connector'
import wixLocation from 'wix-location';
import { local } from 'wix-storage-frontend';
import StringConstants from 'public/common-strings';
import { clearSession } from 'public/session-manager';

$w.onReady( function() {
  console.log("Logout Page loaded ...");
  userLogout();
  clearSession();

} );


function userLogout() {
  console.log('Calling user_logout...');
  user_logout()
    .then(response => {
      console.log('Logout response:', response);
      if(response.status == StringConstants.SUCCESS) {
        local.removeItem('access-token');
      }
      wixLocation.to("/");
    })
    .catch(error => {
      console.error('Error:', error);
    });

    console.log('Calling user_logout done...');

}





