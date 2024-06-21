import wixWindow from 'wix-window';

$w.onReady(function () {
    console.log("Lightbox loaded");
    const receivedData = wixWindow.lightbox.getContext();
    console.log("Received data in Lightbox:", receivedData);

    $w("#userNameOnInfoPopup").text = receivedData.userId;

    if (receivedData) {
		$w("#connectStatus").value = String(receivedData.connectionStatus);
        console.log("Data on LightBox : ", receivedData );
    }
});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function CloseInfoLightBox_click(event) {
	wixWindow.lightbox.close();
}