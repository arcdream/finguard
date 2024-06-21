import { add_user_insurance } from 'backend/user_insurance_connector';

$w.onReady(function () {



});

export function addInsuranceForUser_click(event) {

    var user_id = $w('#userId').value;
    var insurance_provider = $w('#insuranceProvider').value;
    var policy_numbe = $w('#policyNumber').value;
    var insurance_date = $w('#insuranceSubscriptionDate').value;
    


    let dataToInsert = {
        user_id: user_id,
        agent_id: 1008,
        insurance_date: insurance_date.toISOString().split('T')[0],
        insurance_provider: insurance_provider,
        policy_number: policy_numbe

};

add_user_insurance(dataToInsert);

	
}