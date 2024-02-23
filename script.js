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
        
        // Draw rounded rectangle background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        roundedRect(ctx, 0, 0, canvas.width, canvas.height, 10);
        ctx.fill();
        
        // Draw white image
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);
        ctx.drawImage(img, 8, 8, (img.width * ratio) - 16, (img.height * ratio) - 16);

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

// Function to draw rounded rectangle
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
