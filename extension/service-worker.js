import '../src/opencv/utils.js';
import '../src/opencv/opencv.js';
import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js';
import '../test/txt_model/model_16.js';
import '../models/rrn_based_frontend.js';
import '../test/model_from_js.js';

var Module = {
  // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
  onRuntimeInitialized() {
    //   document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    console.log('CV is ready.');

    (async () => {
      await chrome.runtime.sendMessage({ tf: tf, cv: cv });
    })();
  },
};

//   // background.js  // 밑의 방법으로 하면 manifest에서 content없애야 함.
//   chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['content.js'],
//     });
//   });
