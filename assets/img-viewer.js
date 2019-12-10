require([
  'gitbook'
], function(gitbook) {
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
      // Create image viewer
      var imageViewer = document.createElement('div');
      imageViewer.className = 'img-viewer';
      imageViewer.id = 'gitbook-plugin-img-viewer';

      // Create canvas for image to be viewed
      var imageCanvas = document.createElement('canvas');
      var imgTopDis = window.innerHeight - 40 - e.target.naturalHeight > 0 ? (window.innerHeight - 40 - e.target.naturalHeight)/2 : 0;
      imageCanvas.setAttribute('width', e.target.naturalWidth);
      imageCanvas.setAttribute('height', e.target.naturalHeight);
      imageCanvas.setAttribute('style', 'margin-top:' + imgTopDis + 'px');
      var ctx = imageCanvas.getContext('2d');
      ctx.drawImage(e.target, 0, 0);

      imageViewer.appendChild(imageCanvas);
      document.body.firstElementChild.append(imageViewer);
    }

    if (e.target.id === 'gitbook-plugin-img-viewer') {
      document.body.firstElementChild.removeChild(e.target);
    }
  });
})