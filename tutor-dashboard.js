// ===== tutor-dashboard.js =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "tutor") {
  alert("Please log in as a tutor!");
  window.location.href = "index.html";
}

// Welcome message
document.getElementById("welcomeMessage").innerHTML = `Welcome, ${currentUser.firstname} ${currentUser.lastname}! 👋`;

// Bookings
let bookings = JSON.parse(localStorage.getItem("bookings")) || {};
let tutorBookings = bookings[currentUser.email] || [];

function renderBookings() {
  const bookingsSection = document.getElementById("bookings");
  if (!bookingsSection) return;
  
  bookingsSection.innerHTML = "<h3>My Bookings</h3>";

  if (tutorBookings.length === 0) {
    bookingsSection.innerHTML += "<p>No bookings yet.</p>";
    return;
  }

  const ul = document.createElement("ul");
  tutorBookings.forEach((b, index) => {
    const li = document.createElement("li");
    li.innerText = `${b.student} - ${b.course} on ${b.date} [${b.status}]`;
    ul.appendChild(li);
  });
  bookingsSection.appendChild(ul);
}

function updateBookingCount() {
  const totalBookingsCard = document.getElementById("totalBookings");
  const upcomingSessionsCard = document.getElementById("upcomingSessions");
  const pendingRequestsCard = document.getElementById("pendingRequests");
  
  if (totalBookingsCard) totalBookingsCard.innerText = `Total Bookings: ${tutorBookings.length}`;
  if (upcomingSessionsCard) upcomingSessionsCard.innerText = `Upcoming Sessions: ${tutorBookings.filter(b => b.status === "Upcoming").length}`;
  if (pendingRequestsCard) pendingRequestsCard.innerText = `Pending Requests: 0`;
}

function showSection(sectionId) {
  const sections = ["overview", "bookings", "availability", "earnings"];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = id === sectionId ? "block" : "none";
    }
  });
}

// Chart initialization
let bookingsChart = null;
let earningsChart = null;

function initBookingsChart() {
  const ctx = document.getElementById("bookingsChart");
  if (!ctx) return;
  
  bookingsChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Bookings",
        data: [2, 3, 5, 4, 6, tutorBookings.length],
        backgroundColor: "#2563eb"
      }]
    }
  });
}

function initEarningsChart() {
  const ctx = document.getElementById("earningsChart");
  if (!ctx) return;
  
  earningsChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Earnings ($)",
        data: [200, 350, 500, 450, 600, 750],
        borderColor: "#10b981",
        tension: 0.3
      }]
    }
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

renderBookings();
updateBookingCount();
initBookingsChart();
initEarningsChart();

// Make functions global for HTML onclick
window.showSection = showSection;
window.toggleDarkMode = toggleDarkMode;