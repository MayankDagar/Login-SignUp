// Voting system with localStorage persistence
function vote(button, elementId, direction) {
  const storageKey = `vote-${elementId}`;
  const voteCountElement = document.getElementById(`${elementId}-votes`);
  let currentVotes = parseInt(voteCountElement.textContent);
  const previousVote = localStorage.getItem(storageKey);

  // Remove any existing vote class
  button.classList.remove("voted");

  if (previousVote === direction) {
    // Undo vote
    localStorage.removeItem(storageKey);
    if (direction === "up") currentVotes--;
    else if (direction === "down") currentVotes++;
  } else {
    // New vote
    localStorage.setItem(storageKey, direction);
    button.classList.add("voted");

    if (previousVote === "up" && direction === "down") {
      currentVotes -= 2;
    } else if (previousVote === "down" && direction === "up") {
      currentVotes += 2;
    } else if (direction === "up") {
      currentVotes++;
    } else if (direction === "down") {
      currentVotes--;
    }
  }

  voteCountElement.textContent = currentVotes;
}

// Accept answer functionality
function toggleAccepted(button, answerId) {
  const answerElement = document.getElementById(answerId);
  const isAccepted = answerElement.classList.toggle("accepted");
  button.classList.toggle("text-green-600", isAccepted);
  button.classList.toggle("text-gray-300", !isAccepted);
}

// Check for existing votes on page load
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[id$="-votes"]').forEach((element) => {
    const elementId = element.id.replace("-votes", "");
    const storageKey = `vote-${elementId}`;
    const voteDirection = localStorage.getItem(storageKey);

    if (voteDirection) {
      const upButton = element.previousElementSibling.previousElementSibling;
      const downButton = element.nextElementSibling;

      if (voteDirection === "up" && upButton) {
        upButton.classList.add("voted");
      } else if (voteDirection === "down" && downButton) {
        downButton.classList.add("voted");
      }
    }
  });
});
