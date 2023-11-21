const startButton = document.getElementById('startbutton');

const pauseButton = document.getElementById('pausebutton');
console.log(startButton);
startButton.hidden = false;
pauseButton.hidden = false;
//   },
// };
const W = 320;
const H = 180;
startButton.addEventListener('click', () => {
  console.log('START');
  start();
});
pauseButton.addEventListener('click', () => {
  pause();
});

function pause() {
  const srcVideo = document.querySelector('video'); //.getElementById('src_video');

  // const dstVideo = document.getElementById('dst_video');

  srcVideo.pause();
  ////
  if (srcVideo.className === '') {
    srcVideo.classList.add('stop');
  } else {
    srcVideo.classList.replace('play', 'stop');
  }

  // dstVideo.pause();
}
async function start() {
  const srcVideo = document.querySelector('video'); //.getElementById('src_video');
  console.log('tf', tf);
  // const dstVideo = document.getElementById('dst_video');

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

  srcVideo.play();
  //// 클래스로 상태 업데이트
  if (srcVideo.className === '') {
    srcVideo.classList.add('play');
  } else {
    srcVideo.classList.replace('stop', 'play');
  }

  // srcVideo.play();
  srcVideo.requestVideoFrameCallback(interpol);
  // dstVideo.play();
}
