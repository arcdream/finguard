
import { prepareHomeMenuItesm } from 'public/navigation-menu-manager';


$w.onReady( function() {
    console.log("Home Page is Loaded from Win Studio");
    $w('#topNavigationMenu').menuItems = prepareHomeMenuItesm();
  } );
