const fetch = require('node-fetch');


// The churn_limit table can be consulted here https://hackmd.io/@ghosts0301/rkmOjqY7t
const CHURN_LIMIT_THRESHOLD1 = 393126;
const CHURN_LIMIT_THRESHOLD2 = 524288;
const CHURN_LIMIT_THRESHOLD3 = 786432;
const CHURN_LIMIT_THRESHOLD4 = 1048576;

const EPOCHDURATION_MINUTES = 6.4;
const CHURN_SIZE = 4;

// API Request to obtain the number of validators waiting in queue:
async function getQueuedValidators() {
    try {
    // Simple GET request to https://explorer.consensus.mainnet.lukso.network/api/v1/validators/queue
    const response = await fetch('https://explorer.consensus.mainnet.lukso.network/api/v1/validators/queue')
    /* Expected response:
    {
        "status": "OK",
        "data": {
            "beaconchain_entering": 2662,
            "beaconchain_exiting": 0,
            "validatorscount": 75256
        }
    }
    */
    const json = await response.json()
    console.log(json);
    // return the number of queuedValidators and the number of activeValidators
    return [json.data.beaconchain_entering, json.data.validatorscount]; 

    } catch (error) {
        console.log(error.response.body);
        throw("Unable to fetch queue size from LUKSO consensus API");
    }
}


    

// Now we do some simple math to calculate the time instead of the number of validators...
(async () => {
    let [queuedValidators, activeValidators] = await getQueuedValidators();

    // Compute the churn Size, which represents the rate at which validators get activated
    let churn_size;
    if (activeValidators < CHURN_LIMIT_THRESHOLD1) {
        churn_size = 4;
    }
    if ( (activeValidators > CHURN_LIMIT_THRESHOLD1) && (activeValidators < CHURN_LIMIT_THRESHOLD2)) {
        churn_size = 6;
    }
    if ( (activeValidators > CHURN_LIMIT_THRESHOLD2) && (activeValidators < CHURN_LIMIT_THRESHOLD3)) {
        churn_size=8;
    }
    if ( (activeValidators > CHURN_LIMIT_THRESHOLD3) && (activeValidators < CHURN_LIMIT_THRESHOLD4)) {
        churn_size=12;
    }
    if (activeValidators > CHURN_LIMIT_THRESHOLD4) {
        churn_size=16;
    }

    var queueEpochs = Math.ceil(await queuedValidators / churn_size)
    var queueMinutes = queueEpochs * EPOCHDURATION_MINUTES
    var queueHours = queueMinutes / 60;
    console.log(Math.ceil(queueHours))
})();