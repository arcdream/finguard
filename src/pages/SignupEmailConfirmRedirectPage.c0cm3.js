import wixLocation from 'wix-location';

$w.onReady(function () {

    let userRole = wixLocation.query.role;
    $w('#userRoleDisplay').text = userRole;
    console.log("The User has a Role : ", userRole);

    wixLocation.to("/login-signup");

});