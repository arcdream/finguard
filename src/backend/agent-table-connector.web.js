
import { Permissions, webMethod } from "wix-web-module";
import { createClient } from '@supabase/supabase-js';
import { executeSupabasePostRequest, executeSupabaseGetRequest, executeSupabaseUpsertRequest } from 'backend/utils/supabase-utils';

const supabase = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38')



export const updateInsertAgent = webMethod(Permissions.Anyone, async ( profileDataToInsert, accessJWTToken ) => {
  try {

    console.log(" [ agent-table-connector ] - profileDataToInsert : ", profileDataToInsert);
    console.log(" [ agent-table-connector ] - accessJWTToken : ", accessJWTToken);

    const agentInforInsetUrl = '/rest/v1/agents';

    executeSupabaseUpsertRequest(agentInforInsetUrl, profileDataToInsert, accessJWTToken)
    .then((result) => 
    { 
      console.log('Upsert successful:', result); 
      return result;
    })
    .catch(error => console.error('Upsert failed:', error));


  } catch (error) {
    console.error('Error inserting data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  }    
});


export const registerAgent = webMethod(Permissions.Anyone, async ( dataToInsert, accessJWTToken ) => {
  try {

    const agentInforInsetUrl = '/rest/v1/agents'
    return executeSupabasePostRequest(agentInforInsetUrl, dataToInsert, accessJWTToken);

  } catch (error) {
    console.error('Error inserting data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  }    
});

export const read_agent_self_info = webMethod(Permissions.Anyone, async (agentId) => {
  
  try {
    const { data, error } = await supabase.from('agents').select().eq('agent_id', agentId);
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error Reading data:', error.message);
    return { success: false, error: error.message };
  } 
  

});

export const fetchAgentInfoBySupabaseId = webMethod(Permissions.Anyone, async ({ supabaseId, accessJWTToken }) => {
  
  try {
    const agentInforInsetUrl = '/rest/v1/agents?supa_user_id=eq.' + supabaseId;
    const agentInfo = await executeSupabaseGetRequest(agentInforInsetUrl, accessJWTToken);
    console.log("Agent Info in agent-table-connector : ", agentInfo);

    return agentInfo;

  } catch (error) {
    console.error('Error fetching data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  } 
  
});


// Define the API endpoint and your authorization token
const apiUrl = 'https://nkfrnetfnvbmrogdskyd.supabase.co/rest/v1/agents?select=*&pincode=eq.560049';
const authToken = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IjJwVm0xTE9HYnFUaWVpajUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE3NTcyNzYxLCJpYXQiOjE3MTc1NjkxNjEsImlzcyI6Imh0dHBzOi8vbmtmcm5ldGZudmJtcm9nZHNreWQuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFhNTVmM2I2LTNlNzUtNDc4Yy1hM2MzLTMxNjBkNzQwZmM0ZiIsImVtYWlsIjoiYXJjLmRyZWFtQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJhcmMuZHJlYW1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImFhNTVmM2I2LTNlNzUtNDc4Yy1hM2MzLTMxNjBkNzQwZmM0ZiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzE3NTY5MTYxfV0sInNlc3Npb25faWQiOiI5YzA4OGMwYi00NzcwLTQxZDctYjZmMS00MjFmZmEzMGQ4Y2UiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ._vhAcqjoO7ebsI7icPL3SeoUkZgXCeZsbTfbqJiLyww';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38';

// Define the options for the fetch request, including headers for authorization
const fetchOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${authToken}`, 
    'Content-Type': 'application/json',
    'apiKey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38'     
  }
};


async function callApi() {
  try {
    const response = await fetch(apiUrl, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json(); 
    console.log(data);                  
  } catch (error) {
    console.error('Error fetching data:', error); 
  }
}



export const fetch_agent_by_pincode = webMethod(Permissions.Anyone, async (pincode, jwtToken) => {
  
  callApi();

  const token = 'Bearer ${jwtToken}';
  console.log("Amit Jwt Token Received : ", token);

  const supabase1 = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38', {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IjJwVm0xTE9HYnFUaWVpajUiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzE3NTcyNzYxLCJpYXQiOjE3MTc1NjkxNjEsImlzcyI6Imh0dHBzOi8vbmtmcm5ldGZudmJtcm9nZHNreWQuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImFhNTVmM2I2LTNlNzUtNDc4Yy1hM2MzLTMxNjBkNzQwZmM0ZiIsImVtYWlsIjoiYXJjLmRyZWFtQGdtYWlsLmNvbSIsInBob25lIjoiIiwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiZW1haWwiLCJwcm92aWRlcnMiOlsiZW1haWwiXX0sInVzZXJfbWV0YWRhdGEiOnsiZW1haWwiOiJhcmMuZHJlYW1AZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImFhNTVmM2I2LTNlNzUtNDc4Yy1hM2MzLTMxNjBkNzQwZmM0ZiJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6InBhc3N3b3JkIiwidGltZXN0YW1wIjoxNzE3NTY5MTYxfV0sInNlc3Npb25faWQiOiI5YzA4OGMwYi00NzcwLTQxZDctYjZmMS00MjFmZmEzMGQ4Y2UiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ._vhAcqjoO7ebsI7icPL3SeoUkZgXCeZsbTfbqJiLyww',
    },
});


  try {
    
    const { data, error } = await supabase1.from('agents').select().eq('pincode', pincode);
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error Reading data:', error.message);
    return { success: false, error: error.message };
  } 
});

export const fetch_agent_profile_for_user = webMethod(Permissions.Anyone, async (agent_id) => {
  
  try {
    const { data, error } = await supabase.from('agents').select().eq('agent_id', agent_id);
    if (error) {
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error Reading data:', error.message);
    return { success: false, error: error.message };
  } 
});

