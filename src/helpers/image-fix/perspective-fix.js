const { Canvas, createCanvas, loadImage } = require('@napi-rs/canvas');

async function perspectiveFix(inputImage, imageRotation){
    let width = 958, height = 1279;
    const download = await loadImage(inputImage);
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    context.save(); 
    context.rotate((imageRotation * Math.PI) / 180);
    context.drawImage(download, 0, 0, canvas.width, canvas.height);
    context.restore();

	return await canvas.encode('png');
}

module.exports = { perspectiveFix };