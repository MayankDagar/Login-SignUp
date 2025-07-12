document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const userAvatar = document.getElementById("userAvatar");
  const loginContainer = document.getElementById("loginContainer");
  const dashboard = document.getElementById("dashboard");
  const submitButton = document.getElementById("submitButton");
  const usernameInput = document.getElementById("username");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const logoutButton = document.getElementById("logoutButton");
  const dropdownUsername = document.getElementById("dropdownUsername");

  // Check if user is already logged in (from session storage)
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  if (loggedInUser) {
    showDashboard(loggedInUser);
  }

  // Login button click handler
  loginButton.addEventListener("click", function () {
    loginContainer.style.display = "flex";
    dashboard.style.display = "none";
  });

  // Login form submission
  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = document.getElementById("password").value;

    // Basic validation
    if (!username) {
      alert("Please enter your username");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    // Simulate successful login (in a real app, this would be an API call)
    simulateLogin(username);
  });

  // Avatar click handler for dropdown
  userAvatar.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
  });

  // Logout button click handler
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    sessionStorage.removeItem("loggedInUser");
    window.location.reload();
  });

  // Close dropdown when clicking outside
  window.addEventListener("click", function (e) {
    if (!e.target.matches(".user-avatar")) {
      if (dropdownMenu.classList.contains("show")) {
        dropdownMenu.classList.remove("show");
      }
    }
  });

  function simulateLogin(username) {
    // Simulate API delay
    setTimeout(() => {
      // Store user in session storage
      sessionStorage.setItem("loggedInUser", username);

      // Show dashboard
      showDashboard(username);
    }, 500);
  }

  function showDashboard(username) {
    // Hide login button and show avatar
    loginButton.style.display = "none";
    userAvatar.style.display = "block";

    // Update avatar with first letter of username
    userAvatar.src = `https://placehold.co/40x40/4a6bff/ffffff?text=${username
      .charAt(0)
      .toUpperCase()}`;
    userAvatar.alt = `User avatar for ${username}`;

    // Update dropdown username
    dropdownUsername.textContent = username;

    // Show dashboard
    loginContainer.style.display = "none";
    dashboard.style.display = "block";

    // Close dropdown if open
    dropdownMenu.classList.remove("show");
  }
});
