
import { prepareHomeMenuItesm } from 'public/navigation-menu-manager';


$w.onReady( function() {
    console.log("Home Page is Loaded from Win Studio - github");
    $w('#topNavigationMenu').menuItems = prepareHomeMenuItesm();
  } );
