console.log('putinto!!');

const framediv = document
  .getElementById('myIframe')
  .contentWindow.document.querySelector('#Frame');
const originalVideo = document.querySelector('video');
const copiedVideo = document.createElement('video');
copiedVideo.id = originalVideo.id;
copiedVideo.src = originalVideo.src;
copiedVideo.controls = true;
copiedVideo.width = originalVideo.videoWidth;
copiedVideo.height = originalVideo.videoHeight;
copiedVideo.hidden = true;
copiedVideo.crossOrigin = 'anonymous';
framediv.insertAdjacentElement('beforeend', copiedVideo);

// 여기서 originalVidoe의 해상도를 알아내서 js를 동적 load해야 할 듯. -> src만 바꾸는거로 => 이러면 안되나봄.

/// 그러면 방법이 나뉘는데,
//// 1. 바뀌는 모델만 상황따라 다른거로 로드 => resoltion에서 model인식 못함...
//// 2. 모델하고 resolution하고 실행 순서가 있으니까 resolution도 이 때 로드 해야 하나? => 이거 로해야 할 듯..

//// 일단 1번으로 갑니다. 스크립트 삽입 위치는 tensorflowjs바로 다음에. (기존 순서 완벽하게 지키자.)

const body = document
  .getElementById('myIframe')
  .contentWindow.document.querySelector('body');

// const scaleScript = document.createElement('script');
// scaleScript.src = './scale.js';
// scaleScript.type = 'text/javascript';
// body.appendChild(scaleScript);

const dynamicModelScript = document.createElement('script');

if (originalVideo.videoHeight === 144) {
  dynamicModelScript.src = '../test/js_model/elsr_144.js';
} else {
  dynamicModelScript.src = '../test/js_model/elsr_360.js';
}
dynamicModelScript.type = 'text/javascript';
console.log(dynamicModelScript);
body.appendChild(dynamicModelScript);

const elsrScript = document.createElement('script');
elsrScript.src = '../models/elsr.js';
elsrScript.type = 'text/javascript';
body.appendChild(elsrScript);

const modelFromJsNewScript = document.createElement('script');
modelFromJsNewScript.src = '../test/model_from_js_new.js';
modelFromJsNewScript.type = 'text/javascript';
body.appendChild(modelFromJsNewScript);

const resolutionScript = document.createElement('script');
resolutionScript.src = './resolution.js';
resolutionScript.type = 'text/javascript';
body.appendChild(resolutionScript);
//

// tensorflowScript.insertAdjacentElement('afterend', resolutionScript);

// tensorflowScript.insertAdjacentElement('afterend', modelFromJsNewScript);

// tensorflowScript.insertAdjacentElement('afterend', elsrScript);

// tensorflowScript.insertAdjacentElement('afterend', dynamicModelScript);
/// scale값이 동적으로 srcVideo의 해상도 따라 달라지는데, 이게 ../test/model_from_js_new.js에 필요..

// tensorflowScript.insertAdjacentElement('afterend', scaleScript);
