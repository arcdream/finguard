import { Permissions, webMethod } from "wix-web-module";
import { createClient } from '@supabase/supabase-js';
import { executeSupabaseGetRequest } from 'backend/utils/supabase-utils';
import { createBackendResponse } from 'public/backend-response';
import StringConstants from 'public/common-strings';

const supabase = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38')


export const insert_user_agent_callback_request = webMethod(Permissions.Anyone, async (dataToInsert) => {
    try {
      const { data, error } = await supabase.from('user_agent_connect').insert([dataToInsert]);
      if (error) {
        console.log(error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error inserting data:', error.message);
      return { success: false, error: error.message };
    }    
});

/*
Old Functions

export const fetchUserConnectHistory = webMethod(Permissions.Anyone, async (agentId) => {
  
  try {
    const { data, error } = await supabase.from('user_agent_connect').select().eq('agent_id', agentId);
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error Reading data:', error.message);
    return { success: false, error: error.message };
  } 

});
*/

export const fetchUserConnectHistory = webMethod(Permissions.Anyone, async ({ agentId, accessToken } ) => {
  
  try {

    const userConnectHistoryUrl = '/rest/v1/user_agent_connect?agent_id=eq.' + agentId;
    const userConnectHistroy = await executeSupabaseGetRequest(userConnectHistoryUrl, accessToken);
    console.log("[ user-agent-connector-table ] - user connect history : ", userConnectHistroy);

    return createBackendResponse( userConnectHistroy, StringConstants.SUCCESS );

  } catch (error) {
    console.error('Error fetching data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  } 

});


export const fetch_user_connected_agents = webMethod(Permissions.Anyone, async (userId) => {
  
  try {
    const { data, error } = await supabase.from('user_agent_connect').select().eq('user_id', userId);//.distinct('agent_id');
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error Reading data:', error.message);
    return { success: false, error: error.message };
  } 

});



