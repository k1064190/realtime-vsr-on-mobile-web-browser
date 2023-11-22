function model_from_js() {
    const model = build_elsr(scale);

    let tensors = [];

    for (let layer of layers) {
        // layer = [kernel, bias]
        let tensor = [];
        for (let i = 0; i < layer.length; i++) {
            tensor.push(tf.tensor(layer[i]));
        }
        tensors.push(tensor);
    }

    let tensor_idx = 0;
    for (let layer of model.layers) {
        console.log(layer.name)
        console.log(layer.getWeights())
        console.log(tensors[tensor_idx])
        let weights = layer.getWeights();
        if (weights.length > 0) {
            layer.setWeights(tensors[tensor_idx]);
            tensor_idx += 1;
        }
    }

    return model;
}

const model = model_from_js();