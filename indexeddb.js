// Open IndexedDB database
function openDatabase() {
  return new Promise((resolve, reject) => {
    let request = indexedDB.open("fileCacheDB", 1);
    request.onupgradeneeded = function (event) {
      let db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files");
      }
      if (!db.objectStoreNames.contains("metadata")) {
        db.createObjectStore("metadata");
      }
    };
    request.onsuccess = function (event) {
      resolve(event.target.result);
    };
    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}

// Save file to IndexedDB
function saveFileToDB(data, fileName, fileType) {
  openDatabase()
    .then((db) => {
      let transaction = db.transaction("files", "readwrite");
      let store = transaction.objectStore("files");
      let blob = new Blob([data], { type: fileType });
      store.put(blob, fileName);
    })
    .catch((error) => console.error(error));
}

// Save file data (ETag or Last-Modified)
function saveFileMeta(fileName, meta) {
  openDatabase()
    .then((db) => {
      let transaction = db.transaction("metadata", "readwrite");
      let store = transaction.objectStore("metadata");
      store.put(meta, fileName);
    })
    .catch((error) => console.error(error));
}

// Get file data
function getFileMeta(fileName) {
  return new Promise((resolve) => {
    openDatabase()
      .then((db) => {
        let transaction = db.transaction("metadata", "readonly");
        let store = transaction.objectStore("metadata");
        let request = store.get(fileName);
        request.onsuccess = function () {
          resolve(request.result);
        };
      })
      .catch((error) => resolve(null));
  });
}

// Get file from IndexedDB
function getFileFromDB(fileName, callback) {
  openDatabase()
    .then((db) => {
      let transaction = db.transaction("files", "readonly");
      let store = transaction.objectStore("files");
      let request = store.get(fileName);
      request.onsuccess = function () {
        if (request.result) {
          let fileURL = URL.createObjectURL(request.result);
          callback(fileURL);
        } else {
          callback(null);
        }
      };
    })
    .catch((error) => console.error(error));
}

// Fetch and update files from the server
function fetchAndUpdateFile(fileName, fileType) {
  console.log(`Fetching ${fileName}...`); // Debug log
  getFileMeta(fileName).then((savedMeta) => {
    fetch(fileName, { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          console.error(`Failed to fetch ${fileName}: ${response.statusText}`);
          return;
        }
        let newMeta =
          response.headers.get("ETag") || response.headers.get("Last-Modified");
        if (!savedMeta || savedMeta !== newMeta) {
          console.log(`تم تحديث ${fileName}، سيتم تحميل النسخة الجديدة.`);
          fetch(fileName)
            .then((response) => {
              if (!response.ok) {
                console.error(
                  `Failed to fetch ${fileName}: ${response.statusText}`
                );
                return;
              }
              return response.text();
            })
            .then((data) => {
              saveFileToDB(data, fileName, fileType);
              saveFileMeta(fileName, newMeta);
              console.log(`تم تخزين النسخة الجديدة من ${fileName}`);
            });
        } else {
          console.log(`${fileName} لم يتم تغييره، سيتم تحميله من IndexedDB.`);
        }
      })
      .catch((err) => console.error(`Error fetching ${fileName}:`, err));
  });
}

// Load stored files
function loadFiles() {
  getFileFromDB("app.js", function (fileURL) {
    if (fileURL) {
      let script = document.createElement("script");
      script.src = fileURL;
      script.async = true;
      document.body.appendChild(script);
      console.log("تم تحميل app.js من IndexedDB وتشغيله.");
    } else {
      console.warn("تعذر تحميل app.js من IndexedDB.");
    }
  });
}

// Perform file upload and update when page is running
window.onload = function () {
  fetchAndUpdateFile("app.js", "text/javascript");
  loadFiles();
};

function applyStyle() {
  document.body.style.backgroundColor =
    document.body.style.backgroundColor === "lightblue" ? "white" : "lightblue";
  console.log("تم تغيير لون الخلفية!");
}
