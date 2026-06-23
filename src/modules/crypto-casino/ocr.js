const { createWorker } = require('tesseract.js');

async function readText(image) {
  const worker = await createWorker('eng');
  const ret = await worker.recognize(image, { rotateAuto: true });
  await worker.terminate();
  return ret.data.text;
};

module.exports = { readText };