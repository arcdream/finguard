import wixWindowFrontend from "wix-window-frontend"

export function showMessageBox(informationMessage) {

  const dataToSend = {
    message: informationMessage
  };

  wixWindowFrontend.openLightbox('MessageLightBox', dataToSend);

}