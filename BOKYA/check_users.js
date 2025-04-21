// Function to read users from IndexedDB
let db;
const request = indexedDB.open("UserDatabase", 1);

request.onsuccess = function(event) {
    db = event.target.result;
    const transaction = db.transaction(["users"], "readonly");
    const objectStore = transaction.objectStore("users");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function(event) {
        console.log("Stored users:", event.target.result);
    };

    getAllRequest.onerror = function(event) {
        console.error("Error retrieving users:", event);
    };
};

request.onerror = function(event) {
    console.error("Database error:", event.target.errorCode);
};
