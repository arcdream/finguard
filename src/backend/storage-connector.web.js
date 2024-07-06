
import { Permissions, webMethod } from "wix-web-module";
import StringConstants from 'public/common-strings';
import { createBucket, createFolder, uploadFile } from 'backend/utils/supabase-storage-utils';
import { createBackendResponse } from 'public/backend-response';


export const createBucketStorage = webMethod(Permissions.Anyone, async ( bucketName, accessJWTToken ) => {
  try {
    console.log("[ storage-connector ] - bucketName : ", bucketName);
    console.log("[ storage-connector ] - accessJWTToken : ", accessJWTToken);
    const response = await createBucket(bucketName, accessJWTToken);
    console.log("[ storage-connector ] - storage creation response : ", response);
    return createBackendResponse(response, StringConstants.SUCCESS);;
  } catch (error) {
    console.error('Error inserting data:', error.message);
    const errorResponse = () => ({ message: error.message, timestamp: new Date(), status: "failure" });
    return errorResponse;
  }    
});


export const createBucketFolder = webMethod(Permissions.Anyone, async ( bucketName, folderName, accessJWTToken ) => {
  try {
    console.log("[ storage-connector ] - folderName : ", folderName);
    console.log("[ storage-connector ] - accessJWTToken : ", accessJWTToken);
    const response = await createFolder(bucketName, folderName, accessJWTToken);
    console.log("[ storage-connector ] - storage folder creation response : ", response);
    return createBackendResponse( response, StringConstants.SUCCESS );
  } catch (error) {
    console.error('Error inserting data:', error.message);
    return createBackendResponse( error, StringConstants.FAIL );
  }    
});


export const uploadedFileToStorage = webMethod(Permissions.Anyone, async ( storagePath, uploadFilePath, fileName,  accessJWTToken ) => {
  try {
    console.log("[ storage-connector ] - uploadedFileToStorage storagePath : ", storagePath);
    console.log("[ storage-connector ] - uploadedFileToStorage accessJWTToken : ", accessJWTToken);
    console.log("[ storage-connector ] - uploadedFileToStorage fileName : ", fileName);
    console.log("[ storage-connector ] - uploadedFileToStorage uploadFilePath : ", uploadFilePath);
    const response = await uploadFile(storagePath, uploadFilePath, fileName, accessJWTToken);
    console.log("[ storage-connector ] - storage folder creation response : ", response);
    return createBackendResponse( response, StringConstants.SUCCESS );
  } catch (error) {
    console.error('Error inserting data:', error.message);
    return createBackendResponse( error, StringConstants.FAIL );
  }    
});

