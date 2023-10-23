const fetch = require('node-fetch');

const EPOCHDURATION_MINUTES = 6.4;
const CHURN_SIZE = 4;

// API Request to obtain the number of validators waiting in queue:
(async () => {
    try {
  
      const response = await fetch('https://explorer.consensus.mainnet.lukso.network/api/v1/validators/queue')
      const json = await response.json()
  
      console.log(json.url);
      console.log(json.explanation);
    } catch (error) {
      console.log(error.response.body);
    }
  })();


// Simple GET request to https://explorer.consensus.mainnet.lukso.network/api/v1/validators/queue
// Reply:
    /* {
        "status": "OK",
        "data": {
            "beaconchain_entering": 2662,
            "beaconchain_exiting": 0,
            "validatorscount": 75256
        }
    }
    */

// The "beaconchain_entering" value replaces the constant QUEUED_VALIDATORS

// Now we do some simple math to calculate the time instead of the number of validators...
async function main () {
    var queueEpochs = Math.ceil(queuedValidators / CHURN_SIZE)
    var queueMinutes = queueEpochs * EPOCHDURATION_MINUTES
    var queueHours = queueMinutes / 60;
    console.log(Math.ceil(queueHours))
}

main();