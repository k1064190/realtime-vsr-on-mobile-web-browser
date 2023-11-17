function model_from_js() {
    const model = build_rrn();

    let tensors = [];

    let tensor = [];
    for (let i = 0; i < layer1.length; i++) {
        tensor.push(tf.tensor(layer1[i]));
    }
    tensors.push(tensor);

    tensor = [];
    for (let i = 0; i < layer2.length; i++) {
        tensor.push(tf.tensor(layer2[i]));
    }
    tensors.push(tensor);

    tensor = [];
    for (let i = 0; i < layer3.length; i++) {
        tensor.push(tf.tensor(layer3[i]));
    }
    tensors.push(tensor);

    tensor = [];
    for (let i = 0; i < layer4.length; i++) {
        tensor.push(tf.tensor(layer4[i]));
    }
    tensors.push(tensor);

    let tensor_idx = 0;
    for (let layer of model.layers) {
        let weights = layer.getWeights();
        if (weights.length > 0) {
            layer.setWeights(tensors[tensor_idx++]);
        }
    }

    return model;
}

const model = model_from_js();