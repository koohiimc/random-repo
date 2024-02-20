const imageUploader = document.getElementById('image-uploader');
const backgroundColorInput = document.getElementById('background-color');
const applyEffectsButton = document.getElementById('apply-effects');
const downloadAllButton = document.getElementById('download-all');
const imageContainer = document.getElementById('image-container');

function createDownloadLink(image, backgroundColor) {
    const blob = new Blob([image], { type: image.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `edited-${image.name}`;
    link.style.cssText = `
        display: none;
    `;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
}

applyEffectsButton.addEventListener('click', async () => {
    const backgroundColor = backgroundColorInput.value;

    imageContainer.innerHTML = ''; // Clear any existing images

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

