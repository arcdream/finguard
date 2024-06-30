
import { Permissions, webMethod } from "wix-web-module";
import StringConstants from 'public/common-strings';
import { createBucket } from 'backend/utils/supabase-storage-utils';


export const createBucketStorage = webMethod(Permissions.Anyone, async ( bucketName, accessJWTToken ) => {
  try {
    //console.log("[ storage-connector ] - bucketName : ", bucketName);
    //console.log("[ storage-connector ] - accessJWTToken : ", accessJWTToken);
    const response = await createBucket(bucketName, accessJWTToken);
    console.log("[ storage-connector ] - storage creation response : ", response);
    return response;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  }    
});

