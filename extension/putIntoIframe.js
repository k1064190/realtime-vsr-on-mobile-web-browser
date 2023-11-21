console.log('putinto!!');

const framediv = document
  .getElementById('myIframe')
  .contentWindow.document.querySelector('#Frame');
const originalVideo = document.querySelector('video');
const copiedVideo = document.createElement('video');
copiedVideo.id = originalVideo.id;
copiedVideo.src = originalVideo.src;
copiedVideo.controls = true;
copiedVideo.width = '320';
copiedVideo.height = '180';
// copiedVideo.hidden = true;
copiedVideo.crossOrigin = 'anonymous';
framediv.insertAdjacentElement('beforeend', copiedVideo);
