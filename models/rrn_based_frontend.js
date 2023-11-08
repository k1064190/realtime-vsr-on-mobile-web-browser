const height = 180;
const width = 320;
const scale = 4;

class DepthToSpace extends tf.layers.Layer {
    constructor() {
        super({});
        this.block_size = scale;
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
        // console.log("DepthToSpace inputShape: ", inputShape);
        const output_height = (height == null) ? null : height * this.block_size;
        const output_width = (width == null) ? null : width * this.block_size;
        const outDepth = inDepth / (this.block_size * this.block_size);
        return [batch, output_height, output_width, outDepth];
    }

    static get className() {
        return 'DepthToSpace';
    }
}

class BilinearResize extends tf.layers.Layer {
    constructor() {
        super({});
        this.height = scale*height;
        this.width = scale*width;
    }

    call(inputs) {
        return tf.tidy(() => {
            const [input] = inputs;
            return tf.image.resizeBilinear(input, [this.height, this.width]);
        })
    }

    computeOutputShape(inputShape) {
        // console.log("BilinearResize inputShape: ", inputShape);
        const [batch, height, width, inDepth] = inputShape;
        const output_height = (height == null) ? null : this.height;
        const output_width = (width == null) ? null : this.width;
        return [batch, output_height, output_width, inDepth];
    }

    static get className() {
        return 'BilinearResize';
    }
}



function build_residual_block(base_channels) {
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
function build_rrn(back_channels=3, cur_channels=3, base_channels=16) {
    in_channels = 3;
    out_channels = 3;

    const x1 = tf.input({shape: [null, null, back_channels]}); // back_channels = 3
    const x2 = tf.input({shape: [null, null, cur_channels]});  // cur_channels = 3
    const hidden = tf.input({shape: [null, null, base_channels]});

    const h = x1.shape[1];
    const w = x1.shape[2];

    let out = tf.layers.concatenate().apply([x1, x2, hidden]);

    // first conv
    out = tf.layers.conv2d({
        filters: base_channels,
        kernelSize: 3,
        strides: 1,
        padding: 'same',
        activation: 'relu'
    }).apply(out);

    const recon_trunk = tf.sequential();

    // recon_trunk
    for (let i = 0; i < 5; i++) {
        recon_trunk.add(build_residual_block(base_channels));
    }

    out = recon_trunk.apply(out);

    // conv_hidden
    const output_hidden = tf.layers.conv2d({
        filters: base_channels,
        kernelSize: 3,
        strides: 1,
        padding: 'same',
        activation: 'relu'
    }).apply(out);

    // conv_last
    out = tf.layers.conv2d({
        filters: scale * scale * out_channels,
        kernelSize: 3,
        strides: 1,
        padding: 'same'
    }).apply(out);

    out = new DepthToSpace().apply(out);
    let bilinear = new BilinearResize().apply(x2);
    out = tf.layers.add().apply([out, bilinear]);

    return tf.model({inputs: [x1, x2, hidden], outputs: [out, output_hidden]});
}

tf.serialization.registerClass(DepthToSpace);
tf.serialization.registerClass(BilinearResize);
