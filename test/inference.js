const tf = require('@tensorflow/tfjs-node');
const load_model_from_txt = require('./model_from_txt.js')

const fs = require('fs');

const model_path = './ckpt/rnn_based_16';
const txt_path = './txt_model/model_16.txt';

async function loadModel(path) {
    console.log("Trying to load model from " + path);
    const model = await tf.loadLayersModel(`file://${path}/model.json`);
    return model;
}

function loadModelForWindows() {
    const model = load_model_from_txt();
    return model;
}

// Currently for windows
async function infer(img_path) {
    // image를 읽어와서 tensor 형태로 변환
    const buf = fs.readFileSync(img_path);
    let img = tf.node.decodeImage(buf);
    img = tf.expandDims(img, 0);

    const height = img.shape[1];
    const width = img.shape[2];

    const model = await loadModel(model_path);
    model.summary();
    const hidden = tf.zeros([1, height, width, 16]);
    const result = model.predict([img, img, hidden]);

    let output = result[0];
    // output = output.depthToSpace(4, "NHWC");
    // let bilinear = tf.image.resizeBilinear(img, [height * 4, width * 4]);
    // let final_output = tf.add(output, bilinear);
    output = tf.clipByValue(output, 0, 255);
    output = tf.squeeze(output, 0);

    // Save result as image
    const result_img = await tf.node.encodePng(output);
    fs.writeFileSync('./test_img/result1.png', result_img);
}

infer('./test_img/1.png');
