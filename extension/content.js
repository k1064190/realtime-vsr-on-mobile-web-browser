function resolution(srcVideo, tf, cv) {
  let prev_img = null;
  let prev_hidden = tf.zeros([1, 180, 320, 16]);
  let n_frames = 0;
  let cap = new cv.VideoCapture(srcVideo);
  let mat = new cv.Mat(srcVideo.height, srcVideo.width, cv.CV_8UC4);
  let rgb_mat = new cv.Mat(srcVideo.height, srcVideo.width, cv.CV_8UC3);
  let dst_mat = new cv.Mat(srcVideo.height * 4, srcVideo.width * 4, cv.CV_8UC3);

  async function interpol() {
    const start_time = Date.now();
    await cap.read(mat);
    // reshape rgb_mat to tensor
    cv.cvtColor(mat, rgb_mat, cv.COLOR_RGBA2RGB);

    // rgb_mat to tensor with int32
    let tensor = tf.tensor(
      rgb_mat.data,
      [rgb_mat.rows, rgb_mat.cols, 3],
      'int32'
    );
    // [180, 320, 3] -> [1, 180, 320, 3]
    tensor = tf.expandDims(tensor, 0);
    if (n_frames === 0) {
      prev_img = tensor;
    }

    // console.log("tensor.shape: ", tensor.shape);
    // console.log("prev_img.shape: ", prev_img.shape);
    // console.log("prev_hidden.shape: ", prev_hidden.shape);

    // let dst = new cv.Mat();
    // let dsize = new cv.Size(720, 360);
    // cv.resize(mat, dst, dsize, 0, 0, cv.INTER_CUBIC);
    // // console.log("cv_dst: ", dst.data);
    // cv.imshow("exp_video", dst);

    // Upscale with model, tf.tidy for VRAM leak prevention
    let cur_hidden = tf.tidy(() => {
      [dst, hidden] = model.predict([prev_img, tensor, prev_hidden]);

      // clip dst to 0~255
      dst = tf.clipByValue(dst, 0, 255);
      dst = tf.cast(dst, 'int32');

      // dst tensor to dst_mat
      dst_mat.data.set(dst.dataSync());
      cv.imshow('exp_video', dst_mat);

      return hidden;
    });
    // [dst, hidden] = model.predict([prev_img, tensor, prev_hidden]);
    // dst = tf.clipByValue(dst, 0, 255);
    // dst = tf.cast(dst, 'int32');
    //
    // dst_mat.data.set(dst.dataSync());
    // cv.imshow("exp_video", dst_mat);
    // tf.dispose(dst);

    // console.log("dst.shape: ", dst.shape);
    // console.log("hidden.shape: ", hidden.shape);

    // tf.disposeVariables();
    tf.dispose(prev_img);
    tf.dispose(prev_hidden);

    prev_img = tensor;
    prev_hidden = cur_hidden;

    n_frames += 1;

    console.log(`runtime=${Date.now() - start_time}`);
    srcVideo.requestVideoFrameCallback(interpol);
  }

  // srcVideo.play();
  srcVideo.requestVideoFrameCallback(interpol);
  // dstVideo.play();
}
const currentVideo = document.querySelector('video');
console.log('뭐가 문제임', currentVideo);
if (currentVideo) {
  var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      const srcVideo = document.querySelector('video');
      let prev_img = null;
      let prev_hidden = tf.zeros([1, 180, 320, 16]);
      let n_frames = 0;
      let cap = new cv.VideoCapture(srcVideo);
      let mat = new cv.Mat(srcVideo.height, srcVideo.width, cv.CV_8UC4);
      let rgb_mat = new cv.Mat(srcVideo.height, srcVideo.width, cv.CV_8UC3);
      let dst_mat = new cv.Mat(
        srcVideo.height * 4,
        srcVideo.width * 4,
        cv.CV_8UC3
      );

      async function interpol() {
        const start_time = Date.now();
        await cap.read(mat);
        // reshape rgb_mat to tensor
        cv.cvtColor(mat, rgb_mat, cv.COLOR_RGBA2RGB);

        // rgb_mat to tensor with int32
        let tensor = tf.tensor(
          rgb_mat.data,
          [rgb_mat.rows, rgb_mat.cols, 3],
          'int32'
        );
        // [180, 320, 3] -> [1, 180, 320, 3]
        tensor = tf.expandDims(tensor, 0);
        if (n_frames === 0) {
          prev_img = tensor;
        }

        let cur_hidden = tf.tidy(() => {
          [dst, hidden] = model.predict([prev_img, tensor, prev_hidden]);

          // clip dst to 0~255
          dst = tf.clipByValue(dst, 0, 255);
          dst = tf.cast(dst, 'int32');

          // dst tensor to dst_mat
          dst_mat.data.set(dst.dataSync());
          cv.imshow('exp_video', dst_mat);

          return hidden;
        });

        tf.dispose(prev_img);
        tf.dispose(prev_hidden);

        prev_img = tensor;
        prev_hidden = cur_hidden;

        n_frames += 1;

        console.log(`runtime=${Date.now() - start_time}`);
        srcVideo.requestVideoFrameCallback(interpol);
      }

      // srcVideo.play();
      srcVideo.requestVideoFrameCallback(interpol);
      // dstVideo.play();

      // //resolution작업

      //   resolution(currentVideo);
    },
  };

  const setting = async () => {
    const newVideoCanvas = document.createElement('canvas');
    newVideoCanvas.id = 'exp_video';
    newVideoCanvas.width = '1280';
    newVideoCanvas.height = '720';
    const newTitle = document.createElement('h1');
    newTitle.textContent = '[결과 캔버스]';
    newTitle.id = 'h1h1';
    console.log('여기 있따!!');
    const newdiv = document.createElement('div');
    newdiv.id = 'newdiv';

    //   currentVideo.insertAdjacentElement('beforebegin', newTitle);
    newdiv.appendChild(newTitle);
    newdiv.appendChild(newVideoCanvas);
    currentVideo.insertAdjacentElement('afterend', newdiv);

    const body = document.querySelector('body');
    const script1 = document.createElement('script');
    script1.src = '../vsr_web/src/opencv/opencv.js';
    script1.type = 'text/javascript';
    script1.async = true;
    script1.id = 'OpenCV';
    body.appendChild(script1);
    const script2 = document.createElement('script');
    script1.src = '../vsr_web/src/opencv/utils.js';
    script1.type = 'text/javascript';
    body.appendChild(script2);
    // <script src="./src/opencv/utils.js" type="text/javascript"></script>
    // <script async src="./src/opencv/opencv.js" type="text/javascript"></script>
  };
  setting();
}
