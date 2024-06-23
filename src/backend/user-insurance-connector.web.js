import { Permissions, webMethod } from "wix-web-module";
import { createClient } from '@supabase/supabase-js';
import { executeSupabaseGetRequest } from 'backend/utils/supabase-utils';


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



export const fetch_user_subscribed_insurance = webMethod(Permissions.Anyone, async ({ userId, accessJWTToken }) => {
  
  try {

    console.log("--------------------------> ", userId);

    const agentInforInsetUrl = '/rest/v1/user_agent_connect?user_id=eq.' + userId;

    const subscriberPolicies = await executeSupabaseGetRequest(agentInforInsetUrl, accessJWTToken);
    console.log("[ user-insurance-connector ] - supabase response for http get request : ", subscriberPolicies);

    return subscriberPolicies;

  } catch (error) {
    console.error('Error fetching data:', error);
    return createBackendResponse(error, StringConstants.FAIL);
  } 
  
});

