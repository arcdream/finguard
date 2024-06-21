import { fetchAgentByPincode } from 'backend/agent_table_connector';
import wixLocation from 'wix-location';

$w.onReady(function () {
    console.log("Page Load is done");

    // Hide sections and repeater on page load
    //$w('#section5').collapse();
    //$w('#agentDisplayRepeater').collapse();
});

/**
 * Event handler for the search button click.
 * @param {$w.MouseEvent} event
 */
export async function searchAgentButton_click(event) {
    console.log("Search button clicked");

    let pincode = $w('#pinCodeForSearchInput').value;

    if (!validatePincode(pincode)) {
        console.log("Invalid pincode");
        return;
    }

    const agentSearchResult = await fetchAgentsByPincode(pincode);
    console.log("Search result:", agentSearchResult);

    if (agentSearchResult.data.length > 0) {
        const transformedData = agentSearchResult.data.map((item, index) => ({
            _id: index.toString(),
            name: item.first_name,
            agentId: item.agent_id.toString()
        }));
        console.log("Setting the result", transformedData);
        $w("#agentDisplayRepeater").data = transformedData;
        $w("#agentDisplayRepeater").onItemReady(($item, itemData, index) => {
            $item("#name").text = itemData.name;
            $item("#agentId").text = itemData.agentId;

            $item("#viewAgent").onClick(() => viewAgentDetails(itemData.agentId));
        });

        //$w('#section5').expand();
        //$w('#section4').collapse();
    } else {
        console.log('No data found');
        $w("#agentDisplayRepeater").data = [];
    }
}

/**
 * Fetch agents by pincode.
 * @param {string} pincode
 * @returns {Promise<Object>}
 */
async function fetchAgentsByPincode(pincode) {
    try {
        const data = await fetchAgentByPincode(parseInt(pincode));
        console.log('Data fetched:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { data: [] };
    }
}

/**
 * Validate pincode format.
 * @param {string} pincode
 * @returns {boolean}
 */
function validatePincode(pincode) {
    const pincodeRegex = /^[1-9][0-9]{5}$/;
    return pincodeRegex.test(pincode);
}

/**
 * Navigate to agent details page.
 * @param {string} agentId
 */
function viewAgentDetails(agentId) {
    console.log("Viewing agent details for agentId:", agentId);

    const queryParams = {
        id: agentId
    };

    const queryString = Object.keys(queryParams)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join("&");

    wixLocation.to(`/blank-4?${queryString}`);
}
