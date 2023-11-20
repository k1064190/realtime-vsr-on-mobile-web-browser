const currentVideo = document.querySelector('video');
console.log('뭐가 문제임', currentVideo);
if (currentVideo) {
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
}
