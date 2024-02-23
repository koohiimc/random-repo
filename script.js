document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  const files = event.target.files;
  const imageContainer = document.getElementById('imageContainer');
  
  imageContainer.innerHTML = '';

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function(e) {
      const img = new Image();
      img.src = e.target.result;
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const ratio = 256 / Math.max(img.width, img.height);

        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width * ratio, img.height * ratio);

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('imageWrapper');

        const downloadLink = document.createElement('a');
        downloadLink.classList.add('downloadLink');
        downloadLink.innerText = 'Download';
        downloadLink.href = canvas.toDataURL();
        downloadLink.download = 'edited_image_' + i + '.png';

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');
        overlay.appendChild(downloadLink);

        imageWrapper.appendChild(canvas);
        imageWrapper.appendChild(overlay);

        imageContainer.appendChild(imageWrapper);
      }
    };

    reader.readAsDataURL(file);
  }
}
