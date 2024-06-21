/************
.web.js file
************

Backend '.web.js' files contain functions that run on the server side and can be called from page code.

Learn more at https://dev.wix.com/docs/develop-websites/articles/coding-with-velo/backend-code/web-modules/calling-backend-code-from-the-frontend

****/

/**** Call the sample multiply function below by pasting the following into your page code:

import { multiply } from 'backend/new-module.web';

$w.onReady(async function () {
   console.log(await multiply(4,5));
});

****/

import { Permissions, webMethod } from "wix-web-module";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38')


export const add_user_insurance = webMethod(Permissions.Anyone, async (dataToInsert) => {
    try {
      const { data, error } = await supabase.from('user_insurance').insert([dataToInsert]);
      if (error) {
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error inserting data:', error.message);
      return { success: false, error: error.message };
    }    
});

export const fetch_user_subscribed_insurance = webMethod(Permissions.Anyone, async(userId) => {
  try {

    const { data, error } = await supabase.from('user_insurance').select().eq('user_id', userId);
    if (error) {
      throw error;
    }

    console.log("isurance details at backend : ", data);

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return { success: false, error: error.message };
  }    
});


