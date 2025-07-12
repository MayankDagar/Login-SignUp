// Simulate user login from localStorage
let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
let currentUser = localStorage.getItem("username") || "guest_user";

// DOM elements
const askBtn = document.querySelector(".ask-btn");
const modal = document.getElementById("modal");
const loginModal = document.getElementById("loginModal");
const goToLoginBtn = document.getElementById("goToLoginBtn");
const submitBtn = document.querySelector(".submit-btn");
const questionList = document.getElementById("questionList");

// Sample data array
let questions = [];

// Ask button click handler
askBtn.addEventListener("click", () => {
  if (isLoggedIn) {
    modal.style.display = "flex";
  } else {
    loginModal.style.display = "flex";
  }
});

// Close login modal function
function closeLoginModal() {
  loginModal.style.display = "none";
}

// Redirect to login page
goToLoginBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});

// Submit question
submitBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("editor").innerText.trim();
  const tagsInput = document.getElementById("tags").value.trim();
  const tags = tagsInput.split(",").map(tag => tag.trim());

  if (!title || !description || tags.length === 0) {
    alert("Please fill in all fields.");
    return;
  }

  const newQuestion = {
    title,
    description,
    tags,
    user: currentUser,
    answers: 0,
  };

  // Add to UI
  questions.push(newQuestion);
  renderQuestions();

  // Send to backend API
  try {
    const response = await fetch("https://your-api.com/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        // Add Authorization here if needed
      },
      body: JSON.stringify(newQuestion),
    });

    if (response.ok) {
      console.log("Question submitted successfully!");
    } else {
      console.error("Failed to submit question to server.");
    }
  } catch (error) {
    console.error("Error submitting question:", error);
  }

  // Reset form and close modal
  document.getElementById("title").value = "";
  document.getElementById("editor").innerText = "";
  document.getElementById("tags").value = "";
  modal.style.display = "none";
});

// Function to render questions on the page
function renderQuestions() {
  questionList.innerHTML = "";

  questions.forEach((q) => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.innerHTML = `
      <div class="question-content">
        <h2>${q.title}</h2>
        <p>${q.description}</p>
        <div class="tags">${q.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        <div class="user-name">By ${q.user}</div>
      </div>
      <div class="answers">${q.answers}<br/>ans</div>
    `;
    questionList.appendChild(card);
  });
}

// Initial render
renderQuestions();