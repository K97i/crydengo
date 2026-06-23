const { createWorker, createScheduler } = require('tesseract.js');

const WORKER_POOL_SIZE = 2;
const scheduler = createScheduler();
let isInitialized = false;
let initPromise = null;

async function initScheduler() {
    if (isInitialized) return;
    
    const workerPromises = Array.from({ length: WORKER_POOL_SIZE }, async () => {
        const worker = await createWorker('eng', 1, { langPath: 'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast/' }); 
        scheduler.addWorker(worker);
    });

    await Promise.all(workerPromises);
    isInitialized = true;
}

initPromise = initScheduler();

async function readText(image) {
    await initPromise; 
    
    const { data: { text } } = await scheduler.addJob('recognize', image, { rotateAuto: true });
    return text;
}

module.exports = { readText };