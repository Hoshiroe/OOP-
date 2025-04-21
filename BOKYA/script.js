// Function to show the Sign Up form
function showSignUp() {
    document.getElementById('login-form').style.display = 'none'; // Hide Login form
    document.getElementById('signup-form').style.display = 'block'; // Show Sign Up form
}

// Function to show the Login form
function showLogin() {
    document.getElementById('signup-form').style.display = 'none'; // Hide Sign Up form
    document.getElementById('login-form').style.display = 'block'; // Show Login form
}

function togglePassword(fieldId, iconId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(iconId);
    if (field.type === 'password') {
      field.type = 'text';
      icon.textContent = '👁️‍🗨️';
      icon.style.color = '#4CAF50'; // Green when visible
      icon.style.transform = 'scale(1.1)';
    } else {
      field.type = 'password';
      icon.textContent = '👁️';
      icon.style.color = '#666'; // Gray when hidden
      icon.style.transform = 'scale(1)';
    }
    // Add temporary animation
    icon.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      icon.style.transition = '';
    }, 300);
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Function to write to Excel
function writeToExcel(email) {
    console.log("Attempting to write to Excel with email:", email);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([[email]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "SignUps");
    console.log("Worksheet created:", worksheet);
    XLSX.writeFile(workbook, "SignUps.xlsx");
    console.log("Excel file created successfully.");
}

// IndexedDB setup
let db;
const request = indexedDB.open("UserDatabase", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore("users", { keyPath: "email" });
    objectStore.createIndex("password", "password", { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    console.log("IndexedDB opened successfully.");
};

request.onerror = function(event) {
    console.error("Database error: " + event.target.errorCode);
};

function registerUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    // Reset errors
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    
    // Validate email format
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
        passwordError.textContent = "Passwords don't match!";
        passwordError.style.display = 'block';
        return;
    }
    
    // Check if email exists in IndexedDB
    const transaction = db.transaction(["users"], "readonly");
    const objectStore = transaction.objectStore("users");
    const request = objectStore.get(email);

    request.onsuccess = function(event) {
        if (event.target.result) {
            emailError.textContent = 'This email is already registered';
            emailError.style.display = 'block';
            return;
        } else {
            // Proceed with registration
            const newUser = { email: email, password: password };
            const transaction = db.transaction(["users"], "readwrite");
            const objectStore = transaction.objectStore("users");
            objectStore.add(newUser);
            console.log("User added to IndexedDB:", newUser);
            writeToExcel(email); // Write email to Excel
            alert("Registration successful!");
            // Set login state in localStorage
            localStorage.setItem('loggedInUser', email);
            window.location.href = "index.html";
        }
    };

    request.onerror = function(event) {
        console.error('Error checking email:', event);
        alert("An error occurred during registration");
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const footer = document.getElementById('footer');
  
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
  
      if (scrollY + viewportHeight >= fullHeight - 10) {
        footer?.classList.add('visible');
      } else {
        footer?.classList.remove('visible');
      }
    });
});
