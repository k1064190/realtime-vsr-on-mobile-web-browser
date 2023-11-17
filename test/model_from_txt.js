const tf = require('@tensorflow/tfjs-node');
// require('@tensorflow/tfjs-node');
const build_model = require('./models/rrn_based.js');
const fs = require('fs');

// 모델의 레이어를 확인합니다.
function testModel() {
    // 모델을 빌드합니다.
    const model = build_model();
    // 모델의 레이어를 확인합니다.
    model.summary();
    console.log("모델 레이어 확인")
    // for (layer of model.layers) {
    //     console.log(layer.name)
    //     for (weight of layer.getWeights()) {
    //         console.log(weight.name)
    //         console.log(weight.shape)
    //         console.log(weight.arraySync())
    //     }
    // }
}

function testExistingModel(model) {
    // 모델의 레이어를 확인합니다.
    model.summary();
    console.log("모델 레이어 확인")
    for (layer of model.layers) {
        console.log(layer.name)
        for (weight of layer.getWeights()) {
            console.log(weight.name)
            console.log(weight.shape)
            console.log(weight.arraySync())
        }
    }
}

// 텍스트로 저장된 모델을 로드합니다.
function loadModelFromTxt() {
    // 모델을 로드합니다.
    // 모델이 저장된 경로를 지정합니다.
    const modelPath = './txt_model/model_16.txt'
    // 모델을 로드합니다.
    const model = build_model();

    const file = fs.openSync(modelPath, 'r');

    // convert str to array line by line
    const lines = fs.readFileSync(modelPath, 'utf-8')
        .split('\n');
    let tensors = [];
    for (let line of lines) {
        if (line.length == 0) {
            continue;
        }
        // convert line to array
        let arr = JSON.parse(line);

        // convert arr to tensor with dtype float32
        tensor = [];
        for (let i = 0; i < arr.length; i++) {
            tensor.push(tf.tensor(arr[i]));
        }
        tensors.push(tensor);
    }

    model_layers = model.layers;
    let tensor_idx = 0;

    for (let layer of model.layers) {
        // model_layers[i].setWeights(tensors[i]);
        // check if the layer has params
        let weights = layer.getWeights();
        if (weights.length == 0) {
            continue;
        }
        // set weights
        layer.setWeights(tensors[tensor_idx]);
        tensor_idx += 1;
    }

    // 모델을 반환합니다.
    model.summary();
    return model;
}

async function saveModel(model) {
    // 모델이 저장될 경로를 지정합니다.
    const modelPath = 'file://./ckpt/rnn_based_16';

    try {
        // 모델을 저장합니다.
        const saveResults = await model.save(modelPath);
        console.log(saveResults);
    } catch (e) {
        console.log(e);
    }
}


// // 모델을 테스트합니다.
// const model = loadModelFromTxt();
// // testExistingModel(model);
//
// // 모델을 저장합니다.
// // saveModel(model);
// model.save('file://./ckpt/rnn_based_16');


module.exports = loadModelFromTxt;

// let model = loadModelFromTxt();
// saveModel(model);