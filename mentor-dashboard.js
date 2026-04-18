// ===== mentor-dashboard.js =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "mentor") {
  alert("Please log in as a mentor!");
  window.location.href = "index.html";
}

// Welcome message
document.getElementById("welcomeMessage").innerHTML = `Welcome, ${currentUser.firstname} ${currentUser.lastname}! 👋`;

// Mentorship Requests
let mentorshipRequests = JSON.parse(localStorage.getItem("mentorshipRequests")) || [];

function renderMentorshipRequests() {
  const requestsSection = document.getElementById("requests");
  if (!requestsSection) return;
  
  requestsSection.innerHTML = "<h3>Mentorship Requests</h3>";

  if (mentorshipRequests.length === 0) {
    requestsSection.innerHTML += "<p>No requests at the moment.</p>";
    return;
  }

  const ul = document.createElement("ul");
  mentorshipRequests.forEach((r, index) => {
    const li = document.createElement("li");
    li.innerText = `${r.student} - ${r.topic} [${r.status}]`;
    li.style.marginBottom = "10px";
    li.style.padding = "10px";
    li.style.backgroundColor = "#f0f0f0";
    li.style.borderRadius = "8px";

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.style.marginLeft = "10px";
    acceptBtn.style.marginRight = "5px";
    acceptBtn.onclick = () => {
      mentorshipRequests[index].status = "Accepted";
      localStorage.setItem("mentorshipRequests", JSON.stringify(mentorshipRequests));
      renderMentorshipRequests();
      updateRequestCount();
    };

    const declineBtn = document.createElement("button");
    declineBtn.textContent = "Decline";
    declineBtn.onclick = () => {
      mentorshipRequests[index].status = "Declined";
      localStorage.setItem("mentorshipRequests", JSON.stringify(mentorshipRequests));
      renderMentorshipRequests();
      updateRequestCount();
    };

    li.appendChild(acceptBtn);
    li.appendChild(declineBtn);
    ul.appendChild(li);
  });
  requestsSection.appendChild(ul);
}

function updateRequestCount() {
  const pendingRequestsCard = document.querySelector("#overview .cards .card:first-child");
  if (pendingRequestsCard) {
    const pendingCount = mentorshipRequests.filter(r => r.status === "Pending").length;
    pendingRequestsCard.innerText = `Pending Requests: ${pendingCount}`;
  }
}

function showSection(sectionId) {
  const sections = ["overview", "requests", "sessions", "progress"];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = id === sectionId ? "block" : "none";
    }
  });
  
  if (sectionId === "requests") {
    renderMentorshipRequests();
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Update cards with actual data
function updateOverviewCards() {
  const pendingCount = mentorshipRequests.filter(r => r.status === "Pending").length;
  const upcomingSessions = JSON.parse(localStorage.getItem("upcomingSessions")) || [];
  const menteesCount = JSON.parse(localStorage.getItem("assignedMentees")) || [];
  
  const cards = document.querySelectorAll("#overview .cards .card");
  if (cards.length >= 3) {
    cards[0].innerHTML = `<h3>📨 Pending Requests</h3><p>${pendingCount}</p>`;
    cards[1].innerHTML = `<h3>⏰ Upcoming Sessions</h3><p>${upcomingSessions.length}</p>`;
    cards[2].innerHTML = `<h3>👥 Mentees Assigned</h3><p>${menteesCount.length || 0}</p>`;
  }
}

renderMentorshipRequests();
updateRequestCount();
updateOverviewCards();

// Make functions global for HTML onclick
window.showSection = showSection;
window.toggleDarkMode = toggleDarkMode;