const srcVideo = document.querySelector('video');
// 원본에 iframe넣기

const newdiv = document.createElement('div');
newdiv.width = '4000px';
const iframe = document.createElement('iframe');
iframe.id = 'myIframe';
iframe.src = 'extension/iframeContent.html';
iframe.width = '4000px';
iframe.height = '2000px';
newdiv.appendChild(iframe);
srcVideo.insertAdjacentElement('afterend', newdiv);
