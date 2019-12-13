require([
  'gitbook'
], function(gitbook) {
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 27) {
      if (document.getElementById('gitbook-plugin-img-viewer')) {
        document.body.firstElementChild.removeChild(document.getElementById('gitbook-plugin-img-viewer'));
      }
    }
  });

  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'IMG') {
      // Create image viewer
      var imageViewer = document.createElement('div');
      imageViewer.className = 'img-viewer';
      imageViewer.id = 'gitbook-plugin-img-viewer';

      // Create canvas for image to be viewed
      var imageCanvas = document.createElement('canvas');
      var zoomFactor = 1;
      while (e.target.naturalWidth * zoomFactor > window.innerWidth - 40 || e.target.naturalHeight * zoomFactor > window.innerHeight) {
        zoomFactor -= 0.1;
      }
      var newCanvasHeight = e.target.naturalHeight * zoomFactor;
      var newCanvasWidth = e.target.naturalWidth * zoomFactor;
      imageCanvas.setAttribute('width', newCanvasWidth);
      imageCanvas.setAttribute('height', newCanvasHeight);
      var imgTopDis = window.innerHeight - 40 - newCanvasHeight > Number.EPSILON ? (window.innerHeight - 40 - newCanvasHeight)/2 : 0;
      imageCanvas.setAttribute('style', 'margin-top:' + imgTopDis + 'px');
      var ctx = imageCanvas.getContext('2d');
      ctx.drawImage(e.target, 0, 0, newCanvasWidth, newCanvasHeight);

      // Create exit button
      var backBtn = document.createElement('a');
      backBtn.className = 'img-exit';
      backBtn.id = 'gitbook-plugin-img-exit';
      var backIcon = document.createElement('i');
      backIcon.className = 'fa fa-arrow-left fa-lg img-viewer-icon';
      backBtn.appendChild(backIcon);
      backBtn.onclick = function() {
        document.body.firstElementChild.removeChild(document.getElementById('gitbook-plugin-img-viewer'));
      }

      // Create zoom toolbar
      var zoomImage = function(num) {
        if (zoomFactor + num <= Number.EPSILON) {
          return;
        }
        zoomFactor += num;
        var newCanvasHeight = Math.round(e.target.naturalHeight * zoomFactor);
        var newCanvasWidth = Math.round(e.target.naturalWidth * zoomFactor);
        ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
        imageCanvas.setAttribute('width', newCanvasWidth);
        imageCanvas.setAttribute('height', newCanvasHeight);
        imgTopDis = window.innerHeight - 40 - newCanvasHeight > Number.EPSILON ? (window.innerHeight - 40 - newCanvasHeight)/2 : 0;
        imageCanvas.setAttribute('style', 'margin-top:' + imgTopDis + 'px');
        ctx.drawImage(e.target, 0, 0, newCanvasWidth, newCanvasHeight);
        imageViewer.scrollLeft = newCanvasWidth + 40 - window.innerWidth > Number.EPSILON ? Math.floor((newCanvasWidth - window.innerWidth + 40)/2) + 1 : 0;
        imageViewer.scrollTop = newCanvasHeight + 40 - window.innerHeight > Number.EPSILON ? Math.floor((newCanvasHeight - window.innerHeight + 40)/2) + 1 : 0;

        if (imageViewer.scrollLeft + imageViewer.scrollTop > 0) {
          imageCanvas.className = 'img-viewer-draggable';
        } else {
          imageCanvas.className = '';
        }
      }

      window.onresize = function() {
        zoomImage(0.0);
      }

      var toolBar = document.createElement('div');
      toolBar.className = 'img-toolbar';

      var zoomInBtn = document.createElement('a');
      zoomInBtn.className = 'img-toolbar-btn img-toolbar-btn-left';
      var zoomInIcon = document.createElement('i');
      zoomInIcon.className = 'fa fa-plus fa-lg img-viewer-icon-zoom';
      zoomInBtn.appendChild(zoomInIcon);
      zoomInBtn.onclick = function() {
        zoomImage(0.1);
      };

      var zoomOutBtn = document.createElement('a');
      zoomOutBtn.className = 'img-toolbar-btn img-toolbar-btn-right';
      var zoomOutIcon = document.createElement('i');
      zoomOutIcon.className = 'fa fa-minus fa-lg img-viewer-icon-zoom';
      zoomOutBtn.appendChild(zoomOutIcon);
      zoomOutBtn.onclick = function() {
        zoomImage(-0.1);
      };

      var dragX = -1;
      var dragY = -1;

      var onDragStart = function(e) {
        if (imageCanvas.height < window.innerHeight && imageCanvas.width < window.innerWidth) {
          return;
        }
        dragX = e.clientX;
        dragY = e.clientY;
        toolBar.className = 'img-toolbar img-viewer-invisible';
        backBtn.className = 'img-exit img-viewer-invisible';
      }

      var onDragEnd = function() {
        if (imageCanvas.height < window.innerHeight && imageCanvas.width < window.innerWidth) {
          return;
        }
        toolBar.className = 'img-toolbar';
        backBtn.className = 'img-exit';
        dragX = -1;
        dragY = -1;
      }

      imageCanvas.onmousedown = function(e) {
        onDragStart(e);
      }

      imageCanvas.onmousemove = function(e) {
        if (dragX > -1 && dragY > -1) {
          imageViewer.scrollTop += Math.abs((dragY - e.clientY)/1.5) > Number.EPSILON ? (dragY - e.clientY)/1.5 : 0;
          imageViewer.scrollLeft += Math.abs((dragX - e.clientX)/1.5) > Number.EPSILON ? (dragX - e.clientX)/1.5 : 0;
          dragY = Math.abs((dragY - e.clientY)/1.5) > Number.EPSILON ? e.clientY : dragY;
          dragX = Math.abs((dragX - e.clientX)/1.5) > Number.EPSILON ? e.clientX : dragX;
        }
      }

      imageCanvas.onmouseup = function() {
        onDragEnd();
      }

      imageViewer.onmouseout = function() {
        onDragEnd();
      }

      // Constructing html
      toolBar.appendChild(zoomInBtn);
      toolBar.appendChild(zoomOutBtn);

      imageViewer.appendChild(backBtn);
      imageViewer.appendChild(toolBar);
      imageViewer.appendChild(imageCanvas);
      document.body.firstElementChild.append(imageViewer);
    }
  });
})