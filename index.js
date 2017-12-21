(async() => {
    const dotEnv = require('dotenv');
    dotEnv.config();

    const trainerService = require('./lib/trainer.service')();
    trainerService.trainNetwork();
})();