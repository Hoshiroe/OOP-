// Navbar animation and dynamic button replacement script

document.addEventListener('DOMContentLoaded', function() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const navMenu = document.querySelector('.nav-menu');

  // Add fade-in animation to existing buttons
  Array.from(navMenu.children).forEach(li => {
    li.classList.add('fade-in');
  });

  if (loggedInUser) {
    // Remove Sign In and Sign Up buttons with fade-out animation
    const signInBtn = Array.from(navMenu.children).find(li => li.textContent.includes('Sign In'));
    const signUpBtn = Array.from(navMenu.children).find(li => li.textContent.includes('Sign Up'));

    if (signInBtn) {
      signInBtn.classList.add('fade-out');
      setTimeout(() => navMenu.removeChild(signInBtn), 500);
    }
    if (signUpBtn) {
      signUpBtn.classList.add('fade-out');
      setTimeout(() => navMenu.removeChild(signUpBtn), 500);
    }

    // Add Profile button with fade-in animation after removal
    setTimeout(() => {
    const profileLi = document.createElement('li');
    profileLi.style.position = 'relative';

    const profileBtn = document.createElement('button');
    profileBtn.classList.add('profile-circle');
    profileBtn.textContent = loggedInUser ? loggedInUser.charAt(0).toUpperCase() : 'U';

    // Create dropdown menu inside the button container
    const dropdownMenu = document.createElement('ul');
    dropdownMenu.classList.add('profile-dropdown');
    dropdownMenu.style.display = 'none';

    const menuItems = [
      { text: 'View/Update Personal Info', action: () => { console.log('View/Update Personal Info clicked'); /* TODO: Add navigation */ } },
      { text: 'See their emergency submissions', action: () => { console.log('See their emergency submissions clicked'); /* TODO: Add navigation */ } },
      { text: 'My Account', action: () => { console.log('My Account clicked'); /* TODO: Add navigation */ } }
    ];

    menuItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.text;
      li.tabIndex = 0;
      li.addEventListener('click', () => {
        item.action();
        dropdownMenu.style.display = 'none';
      });
      li.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          item.action();
          dropdownMenu.style.display = 'none';
        }
      });
      dropdownMenu.appendChild(li);
    });

    profileBtn.addEventListener('click', () => {
      if (dropdownMenu.style.display === 'none') {
        dropdownMenu.style.display = 'block';
      } else {
        dropdownMenu.style.display = 'none';
      }
    });

    // Close dropdown if clicked outside
    document.addEventListener('click', (event) => {
      if (!profileLi.contains(event.target)) {
        dropdownMenu.style.display = 'none';
      }
    });

    profileLi.appendChild(profileBtn);
    profileLi.appendChild(dropdownMenu);
    profileLi.classList.add('fade-in');
    navMenu.appendChild(profileLi);
    }, 500);
  }
});

// CSS animations for fade-in and fade-out
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  .fade-out {
    animation: fadeOut 0.5s ease forwards;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(style);
