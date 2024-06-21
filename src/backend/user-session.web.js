
import { Permissions, webMethod } from "wix-web-module";
import { createClient } from '@supabase/supabase-js';
import { local, session } from 'wix-storage';

const supabase = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38')



export const getUserFromSupabaseSession = webMethod(Permissions.Anyone, async () => {
  try {

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error fetching session:', sessionError);
      return;
    }

    if (sessionData.session) {
      console.log('User is logged in:', sessionData.session.user);
    } else {
      console.log('No user session found.');
    }
 

  } catch (error) {
    console.error('Error getting user data data:', error.message);
    return null;
  }    



});


/*
export const getUserFromSupabaseSession = webMethod(Permissions.Anyone, async () => {
  try {

    const { data, error } = await supabase.auth.getSession();
    
    //const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
    } else if (data.user) {
      console.log("User is authenticated:", data.user);
    } else {
      console.log("No user session found.");
    }

  } catch (error) {
    console.error('Error getting user data data:', error.message);
    return null;
  }    
});

*/