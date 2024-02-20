const imageUploader = document.getElementById('image-uploader');
const backgroundColorInput = document.getElementById('background-color');
const applyEffectsButton = document.getElementById('apply-effects');
const downloadAllButton = document.getElementById('download-all');
const imageContainer = document.getElementById('image-container');

function createDownloadLink(image, backgroundColor) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;

    // Create the edited image with background and rounded corners
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);

    // Convert the canvas to a blob and create a temporary download link
    const blob = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = blob;
    link.download = `edited-${image.name}`;
    link.style.cssText = `
        display: none;
    `;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
    document.body.removeChild(link);
}

applyEffectsButton.addEventListener('click', async () => {
    const backgroundColor = backgroundColorInput.value;

    imageContainer.innerHTML = ''; // Clear existing images

    for (const file of imageUploader.files) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                // Create a canvas to edit the image
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image at a smaller size centered on the canvas
                const maxImageWidth = Math.min(canvas.width * 0.8, canvas.height * 0.8);
                const imageRatio = img.width / img.height;
                const imageWidth = imageRatio > 1 ? maxImageWidth : maxImageWidth * imageRatio;
                const imageHeight = imageRatio > 1 ? maxImageWidth / imageRatio : maxImageWidth;
                const imageX = (canvas.width - imageWidth) / 2;
                const imageY = (canvas.height - imageHeight) / 2;
                context.drawImage(img, imageX, imageY, imageWidth, imageHeight);

                // Add rounded corners using clipping mask
                context.beginPath();
                context.arc(imageX + imageWidth / 2, imageY + imageHeight / 2, imageWidth / 2, 0, Math.PI * 2);
                context.closePath();
                context.clip();

                // Create and download the edited image
                createDownloadLink(image, backgroundColor);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

downloadAllButton.addEventListener('click', async () => {
    // Trigger the apply effects button click to ensure images are edited first
    applyEffectsButton.click();
});
