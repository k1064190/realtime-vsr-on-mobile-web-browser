// 파일명 바꿈.
const startButton = document.getElementById('startbutton');
console.log(layers);
const pauseButton = document.getElementById('pausebutton');
console.log(startButton);
startButton.hidden = false;
pauseButton.hidden = false;
//   },
// };

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
  const W = srcVideo.videoWidth;
  const H = srcVideo.videoHeight; // 해상도
  // const scale = 720 / H; // 이전에 전역으로 삽입될 것임.
  console.log('SCALE', scale, srcVideo.videoHeight * scale, model);

  let prev_img = null;
  let prev_hidden = tf.zeros([1, 180, 320, 16]);
  let n_frames = 0;
  let cap = new cv.VideoCapture(srcVideo);

  let mat = new cv.Mat(srcVideo.videoHeight, srcVideo.videoWidth, cv.CV_8UC4);
  let rgb_mat = new cv.Mat(
    srcVideo.videoHeight,
    srcVideo.videoWidth,
    cv.CV_8UC3
  );
  let dst_mat = new cv.Mat(
    srcVideo.videoHeight * scale,
    srcVideo.videoWidth * scale,
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

    tf.tidy(() => {
      sr = model.predict(tensor);

      // clip dst to 0~255
      sr = tf.clipByValue(sr, 0, 255);
      sr = tf.cast(sr, 'int32');

      // dst tensor to dst_mat
      dst_mat.data.set(sr.dataSync());
      cv.imshow('exp_video', dst_mat);
    });

    tensor.dispose();

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
