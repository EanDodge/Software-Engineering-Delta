// database.js
//need created to store picture of screen to be used as background for upgrade screen
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('screenshotsDB', 1);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore('screenshots', { keyPath: 'id' });
        };
        request.onsuccess = event => {
            console.log('Database opened successfully');
            resolve(event.target.result);
        };
        request.onerror = event => {
            console.log('Database opened UNsuccessfully');

            reject(event.target.error);
        };
    });
}

function storeScreenshot(db, dataUrl) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('screenshots', 'readwrite');
        const store = transaction.objectStore('screenshots');
        const request = store.put({ id: 'screenshot', data: dataUrl });
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

function retrieveScreenshot(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('screenshots', 'readonly');
        const store = transaction.objectStore('screenshots');
        const request = store.get('screenshot');
        request.onsuccess = event => {
            resolve(event.target.result?.data);
        };
        request.onerror = event => {
            reject(event.target.error);
        };
    });
}

async function setBackgroundFromScreenshot() {
    try {
        const db = await openDatabase();
        const screenshotDataUrl = await retrieveScreenshot(db);

        if (screenshotDataUrl) {
            document.body.style.backgroundImage = `url(${screenshotDataUrl})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundRepeat = 'no-repeat';
        } else {
            console.log('No screenshot found in IndexedDB.');
        }
    } catch (error) {
        console.error('Error retrieving screenshot:', error);
    }
}

// Call the function to set the background after the DOM content is loaded
document.addEventListener('DOMContentLoaded', setBackgroundFromScreenshot);
