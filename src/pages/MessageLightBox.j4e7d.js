import wixWindow from 'wix-window';

$w.onReady(function () {
    console.log("Lightbox loaded");
    const receivedData = wixWindow.lightbox.getContext();
    console.log("Received data in Lightbox:", receivedData);
	$w("#msgInfoTextDisplay").text = receivedData.message;
});

/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function CloseInfoLightBox_click(event) {
	wixWindow.lightbox.close();
}