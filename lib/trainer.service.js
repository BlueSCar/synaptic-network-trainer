module.exports = () => {
    const synaptic = require('synaptic');
    const fs = require('fs');
    const Trainer = synaptic.Trainer,
        Architect = synaptic.Architect;

    const networkPath = process.env.NETWORK;
    const tempNetworkPath = process.env.TEMP_NETWORK;
    const dataSetPath = process.env.TRAINING_DATASET;
    const testDataPath = process.env.TEST_DATASET;
    const trainingRate = process.env.TRAINING_RATE;

    const hiddenInputs = process.env.HIDDEN_INPUTS;

    const shuffle = (a) => {
        var j, x, i, b = a;
        for (i = b.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = b[i - 1];
            b[i - 1] = b[j];
            b[j] = x;
        }
        return b;
    }

    const trainNetwork = () => {
        const trainingSet = require(dataSetPath);
        const testSet = require(testDataPath);

        const inputs = trainingSet[0].input.length;
        const outputs = trainingSet[0].output.length

        let myNetwork = new Architect.Perceptron(inputs, hiddenInputs, outputs);
        let trainer = new Trainer(myNetwork);

        let error = 1;

        for (var i = 1; i < 50000; i++) {
            trainer.train(shuffle(trainingSet), {
                rate: trainingRate,
                iterations: 1,
                error: 0.005,
                shuffle: true
            });

            let testResult = trainer.test(testSet);

            if (testResult.error < error) {
                error = testResult.error;
                console.log(`New record at iteration ${i}: ${error}`);

                fs.writeFileSync(tempNetworkPath, JSON.stringify(myNetwork.toJSON(), null, '\t'));
            }
        }

        fs.writeFileSync(networkPath, JSON.stringify(myNetwork.toJSON(), null, '\t'));
    }

    const retrieveNetwork = () => {
        let network = require(networkPath);
        let myNetwork = Architect.Perceptron.fromJSON(network);

        return myNetwork;
    }

    const testNetwork = () => {
        const network = retrieveNetwork();
        const testSet = require(testDataPath);
        const trainer = new Trainer(network);

        const result = trainer.test(testSet);

        console.log(result.error);
    }

    return {
        trainNetwork: trainNetwork,
        retrieveNetwork: retrieveNetwork,
        testNetwork: testNetwork
    }
}