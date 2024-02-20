document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('downloadButton').addEventListener('click', downloadImages);
document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);
document.getElementById('colorPicker').addEventListener('input', changeImageColor);

function handleFileSelect(event) {
  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')) {
      continue;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const imageSize = document.getElementById('imageSize').value;
        const newSize = parseInt(imageSize);

        canvas.width = newSize;
        canvas.height = newSize;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 20, 20, newSize - 40, newSize - 40);

        const roundedCanvas = document.createElement('canvas');
        const roundedCtx = roundedCanvas.getContext('2d');
        roundedCanvas.width = newSize;
        roundedCanvas.height = newSize;

        roundedCtx.beginPath();
        roundedCtx.moveTo(20, 0);
        roundedCtx.lineTo(canvas.width - 20, 0);
        roundedCtx.quadraticCurveTo(canvas.width, 0, canvas.width, 20);
        roundedCtx.lineTo(canvas.width, canvas.height - 20);
        roundedCtx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - 20, canvas.height);
        roundedCtx.lineTo(20, canvas.height);
        roundedCtx.quadraticCurveTo(0, canvas.height, 0, canvas.height - 20);
        roundedCtx.lineTo(0, 20);
        roundedCtx.quadraticCurveTo(0, 0, 20, 0);
        roundedCtx.closePath();
        roundedCtx.clip();

        roundedCtx.drawImage(canvas, 0, 0);

        const roundedImage = new Image();
        roundedImage.src = roundedCanvas.toDataURL();

        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');
        imageWrapper.appendChild(roundedImage);

        document.getElementById('imageContainer').appendChild(imageWrapper);
      };
    };

    reader.readAsDataURL(file);
  }
}

function downloadImages() {
  console.log("Download button clicked"); // Debugging

  const images = document.querySelectorAll('.image-wrapper img');
  const zip = new JSZip();

  images.forEach((image, index) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.drawImage(image, 0, 0);

    const dataURL = canvas.toDataURL('image/png');

    // Remove the beginning of the dataURL to get only the base64 encoded data
    const base64Data = dataURL.split(',')[1];

    zip.file(`image_${index + 1}.png`, base64Data, { base64: true });
  });

  zip.generateAsync({ type: 'blob' }).then(function(content) {
    console.log("Zip generated"); // Debugging

    saveAs(content, 'images.zip');
  }).catch(function(error) {
    console.error("Error generating zip file:", error); // Debugging
  });
}


function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}

function changeImageColor() {
  const color = document.getElementById('colorPicker').value;
  const images = document.querySelectorAll('.image-wrapper img');
  const container = document.querySelector('.container');
  container.style.backgroundColor = color;

  images.forEach(image => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-atop';
    ctx.drawImage(image, 0, 0);

    image.src = canvas.toDataURL();
  });
}
