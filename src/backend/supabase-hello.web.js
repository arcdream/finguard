import { createClient } from '@supabase/supabase-js'
import { Permissions, webMethod } from 'wix-web-module';
import { mediaManager } from 'wix-media-backend';
const fetch = require('node-fetch'); 

const supabase = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38')


  export const addNumbers = webMethod(Permissions.Anyone, async () => {



    const supabaseUrl = 'https://nkfrnetfnvbmrogdskyd.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMDcwNDAsImV4cCI6MjAyOTc4MzA0MH0.RF60ffzuy73mn7o1cYqBPGSzhLKf8-LHcozxFc5bY38';
    const tableName = 'Agent';
  
    const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch data from Supabase');
    }
  
    const data = await response.json();
    console.log('Data from Supabase:', data);

    return "success";


    });

  export const insertRecord = webMethod(Permissions.Anyone, async () => {


    console.log("---- Insert from backend ----");

    const { data, error } = await supabase
    .from('Agent')
    .insert([
      { first_name: 'kundan' },
    ])
    .select()

    console.log("----- Insert Record Done - 1 ----------")
    console.log(data)
    console.log("----- Insert Record Done - 2 ----------")

    return data;
    });

  export const createBucket = webMethod(Permissions.Anyone, async (bucketName) => {

    const supabase_bucket = createClient('https://nkfrnetfnvbmrogdskyd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZnJuZXRmbnZibXJvZ2Rza3lkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNDIwNzA0MCwiZXhwIjoyMDI5NzgzMDQwfQ.y6wQVZwkGFcjf5t6lXXlAn4G6vJTfChIt0ExSdDVlmg')



      console.log('Amit from bucket - 123 ', bucketName);

      const { data, error } = await supabase_bucket.storage.createBucket('/agent_bucket/avatars', {
        public: true, 
      })
   
      console.log('create bucket backend - 1 : ', data);
      console.log('create bucket backend - 2 : ', error);

      return data;

      });


    export const uploadFileToBucket = webMethod(Permissions.Anyone, async (bucketName, fileName, publicURL) => {

        console.log('Amit from bucket file upload ', publicURL);
  

        try {
          // Download the file from the public URL
          const response = await fetch(publicURL);
          if (!response.ok) {
              throw new Error(`Failed to download file from public URL: ${response.statusText}`);
          }
          const fileData = await response.buffer(); // Get the file content as a buffer
  
          // Upload the file to Supabase Storage
          const { data, error } = await supabase.storage.from(bucketName).upload('/myfolder/' + fileName, fileData);
          if (error) {
              throw error;
          }
          console.log(`File "${fileName}" uploaded successfully to bucket "${bucketName}"`);
          return data; // Return the upload result if needed
      } catch (error) {
          console.error('Error uploading file:', error.message);
          throw error; // Rethrow the error for handling at the caller's level
      }
  
        });




 

  