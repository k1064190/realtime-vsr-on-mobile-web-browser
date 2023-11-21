console.log('putinto!!');

const framediv = document
  .getElementById('myIframe')
  .contentWindow.document.querySelector('#Frame');
const originalVideo = document.querySelector('video');
const copiedVideo = document.createElement('video');
copiedVideo.src = originalVideo.src;
copiedVideo.controls = true;
framediv.insertAdjacentElement('beforeend', copiedVideo);
