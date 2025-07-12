/*===== LOGIN SHOW and HIDDEN =====*/
const signUp = document.getElementById("sign-up"),
  signIn = document.getElementById("sign-in"),
  loginIn = document.getElementById("login-in"),
  loginUp = document.getElementById("login-up");

signUp.addEventListener("click", () => {
  // Remove classes first if they exist
  loginIn.classList.remove("block");
  loginUp.classList.remove("none");

  // Add classes
  loginIn.classList.toggle("none");
  loginUp.classList.toggle("block");
});

signIn.addEventListener("click", () => {
  // Remove classes first if they exist
  loginIn.classList.remove("none");
  loginUp.classList.remove("block");

  // Add classes
  loginIn.classList.toggle("block");
  loginUp.classList.toggle("none");
});
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-submit");

  loginBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get form input values
    const username = document
      .querySelector("#login-in input[placeholder='Username']")
      .value.trim();
    const password = document
      .querySelector("#login-in input[placeholder='Password']")
      .value.trim();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        console.log("Response:", data);
        // You can store token or redirect here
        // localStorage.setItem("token", data.token);
        // window.location.href = "/dashboard.html";
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Sign Up button event
  const signupBtn = document.getElementById("signup-submit");

  signupBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Get values from Sign Up form
    const username = document
      .querySelector("#login-up input[placeholder='Username']")
      .value.trim();
    const email = document
      .querySelector("#login-up input[placeholder='Email']")
      .value.trim();
    const password = document
      .querySelector("#login-up input[placeholder='Password']")
      .value.trim();

    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        console.log("Registered user:", data);
        // Optionally redirect or switch to login
        // document.getElementById("sign-in").click();
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    }
  });
});