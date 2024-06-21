import { Permissions, webMethod } from 'wix-web-module';
import { mediaManager } from 'wix-media-backend';

export const getUploadUrlForPdf = webMethod(Permissions.Anyone, (folderPath) => {
    if (!folderPath.startsWith("/")) {
        folderPath = `/${folderPath}`;
    }
    
    return mediaManager.getUploadUrl(
        folderPath,
        {
            "mediaOptions": {
                "mimeType": "image/jpeg",
                "mediaType": "image"
            },
            "metadataOptions": {
                "isPrivate": false,
                "isVisitorUpload": false,
                "context": {
                    "someKey1": "someValue1",
                    "someKey2": "someValue2"
                }
            }
        }
    );
});

export const myGetDownloadUrlFunction = webMethod(Permissions.Anyone, async (fileUrl) => {
	const myFileDownloadUrl = await mediaManager.getDownloadUrl(fileUrl);  
	return myFileDownloadUrl;
  });


export const importFile = webMethod(Permissions.Anyone, (url) => {
  return mediaManager.importFile(
    "/amit",
    url,
    {
      "mediaOptions": {
        "mimeType": "image/jpeg",
        "mediaType": "image"
      },
      "metadataOptions": {
        "isPrivate": false,
        "isVisitorUpload": false,
        "context": {
          "someKey1": "someValue1",
          "someKey2": "someValue2"
        }
      }
    }
  );
});

