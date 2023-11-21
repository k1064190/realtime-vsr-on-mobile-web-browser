class DepthToSpace extends tf.layers.Layer {
    constructor(upscale_factor) {
        super({});
        this.block_size = upscale_factor;
    }

    // call(input) {
    //     return tf.depthToSpace(input, this.block_size, "NHWC");
    // }
    call(inputs) {
        return tf.tidy(() => {
            const [input] = inputs;
            return tf.depthToSpace(input, this.block_size);
        });
    }

    computeOutputShape(inputShape) {
        const [batch, height, width, inDepth] = inputShape;
        console.log("DepthToSpace inputShape: ", inputShape);
        const output_height = (height == null) ? null : height * this.block_size;
        const output_width = (width == null) ? null : width * this.block_size;
        const outDepth = inDepth / (this.block_size * this.block_size);
        return [batch, output_height, output_width, outDepth];
    }

    static get className() {
        return 'DepthToSpace';
    }
}

function build_resblock(base_channels) {
    identity = tf.input({shape: [null, null, base_channels]});
    out = tf.layers.conv2d({
        filters: base_channels,
        kernelSize: 3,
        strides: 1,
        padding: 'same',
        activation: 'relu'
    }).apply(identity);
    out = tf.layers.conv2d({
        filters: base_channels,
        kernelSize: 3,
        strides: 1,
        padding: 'same'
    }).apply(out);
    out = tf.layers.add().apply([identity, out]);
    return tf.model({inputs: identity, outputs: out});
}


// tfjs model
function build_elsr(upscale_factor) {
    let input = tf.input({shape: [null, null, 3]});
    let out = tf.layers.conv2d({
        filters: 6,
        kernelSize: 3,
        strides: 1,
        padding: 'same',
        activation: 'relu'
    }).apply(input);
    out = build_resblock(6).apply(out);
    out = tf.layers.conv2d({
        filters: 3 * upscale_factor * upscale_factor,
        kernelSize: 3,
        strides: 1,
        padding: 'same'
    }).apply(out);
    out = new DepthToSpace(upscale_factor).apply(out);
    let model = tf.model({inputs: input, outputs: out});

    return model;
}

tf.serialization.registerClass(DepthToSpace);
