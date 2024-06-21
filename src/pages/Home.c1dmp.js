
import { prepareHomeMenuItesm } from 'public/navigation-menu-manager';


$w.onReady( function() {
    console.log("Home Page is Loaded");
    $w('#topNavigationMenu').menuItems = prepareHomeMenuItesm();
  } );
