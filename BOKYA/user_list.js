// user_list.js
// Script to render user list excluding the logged-in user ("my account")

document.addEventListener('DOMContentLoaded', function() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const userListContainer = document.getElementById('user-list-container');

  if (!userListContainer) {
    console.warn('User list container not found');
    return;
  }

  // Open IndexedDB and fetch users
  const request = indexedDB.open("UserDatabase", 1);

  request.onsuccess = function(event) {
    const db = event.target.result;
    const transaction = db.transaction(["users"], "readonly");
    const objectStore = transaction.objectStore("users");
    const getAllRequest = objectStore.getAll();

    getAllRequest.onsuccess = function(event) {
      const users = event.target.result;

      // Filter out the logged-in user
      const filteredUsers = users.filter(user => user.email !== loggedInUser);

      // Clear existing list
      userListContainer.innerHTML = '';

      if (filteredUsers.length === 0) {
        userListContainer.textContent = 'No other users found.';
        return;
      }

      // Create list element
      const ul = document.createElement('ul');
      ul.classList.add('user-list');

      filteredUsers.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('user-list-item');
        li.textContent = user.email;
        ul.appendChild(li);
      });

      userListContainer.appendChild(ul);
    };

    getAllRequest.onerror = function(event) {
      console.error("Error retrieving users:", event);
      userListContainer.textContent = 'Error loading user list.';
    };
  };

  request.onerror = function(event) {
    console.error("Database error:", event.target.errorCode);
    userListContainer.textContent = 'Error opening database.';
  };
});
