const { createWorker } = require('tesseract.js');

async function readText(image) {
  const worker = await createWorker('eng'); // Specify language (e.g., English)
  const ret = await worker.recognize(image);
  await worker.terminate();
  return ret.data.text;
};

module.exports = { readText };