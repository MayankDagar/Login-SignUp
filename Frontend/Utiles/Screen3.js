const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
const currentUser = localStorage.getItem("username") || "guest_user";
let currentVote = 0;
let questionId = "q123"; // Replace with real ID

// On page load
window.onload = async () => {
  setupAuth();
  await fetchAnswers();
  await fetchVoteCount();
};

function setupAuth() {
  const input = document.getElementById("answerInput");
  const button = document.querySelector(".answer-box button");

  if (!isLoggedIn) {
    input.disabled = true;
    input.placeholder = "You must login to post an answer.";
    button.innerText = "Login to Answer";
    button.onclick = () => window.location.href = "login.html";
  }
}

async function fetchAnswers() {
  const res = await fetch(`https://your-api.com/api/questions/${questionId}/answers`);
  const data = await res.json();
  data.forEach(addAnswerToUI);
}

async function fetchVoteCount() {
  const res = await fetch(`https://your-api.com/api/questions/${questionId}/votes`);
  const data = await res.json();
  currentVote = data.votes || 0;
  updateVoteDisplay();
}

function updateVoteDisplay() {
  document.querySelector(".vote-count").innerText = currentVote;
}

// UPVOTE/DOWNVOTE
document.querySelectorAll(".vote-btn")[0].onclick = async () => {
  if (currentVote < 10) currentVote++;
  await updateVoteBackend();
};

document.querySelectorAll(".vote-btn")[1].onclick = async () => {
  if (currentVote > 0) currentVote--;
  await updateVoteBackend();
};

async function updateVoteBackend() {
  await fetch(`https://your-api.com/api/questions/${questionId}/votes`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ votes: currentVote })
  });
  updateVoteDisplay();
}

// Submit answer
async function submitAnswer() {
  const answerText = document.getElementById("answerInput").value.trim();
  if (!answerText) return alert("Answer can't be empty");

  const answerData = {
    user: currentUser,
    content: answerText,
    timestamp: new Date().toISOString()
  };

  const res = await fetch(`https://your-api.com/api/questions/${questionId}/answers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answerData)
  });

  if (res.ok) {
    document.getElementById("answerInput").value = "";
    addAnswerToUI(answerData);
  } else {
    alert("Failed to post answer");
  }
}

// Append answer to UI
function addAnswerToUI({ user, content, timestamp }) {
  const answersList = document.getElementById("answersList");

  const div = document.createElement("div");
  div.className = "answer-card";
  div.innerHTML = `
    <div class="answer-meta"><strong>${user}</strong> • ${new Date(timestamp).toLocaleString()}</div>
    <p>${content}</p>
    <div class="comment-section">
      <textarea placeholder="Add a comment..." rows="2"></textarea>
      <button onclick="submitComment(this)">Comment</button>
      <div class="comments"></div>
    </div>
  `;

  answersList.prepend(div);
}

// Submit comment
async function submitComment(btn) {
  if (!isLoggedIn) return alert("Please login to comment.");

  const card = btn.closest(".answer-card");
  const textarea = card.querySelector("textarea");
  const comment = textarea.value.trim();

  if (!comment) return alert("Comment cannot be empty.");

  const commentObj = {
    user: currentUser,
    text: comment,
    timestamp: new Date().toISOString()
  };

  // Save to backend
  await fetch("https://your-api.com/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answerId: "answer123", // Use the correct answer ID in real case
      ...commentObj
    })
  });

  // Append to UI
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment";
  commentDiv.innerHTML = `<strong>${commentObj.user}</strong>: ${commentObj.text}`;
  card.querySelector(".comments").appendChild(commentDiv);

  textarea.value = "";
}
