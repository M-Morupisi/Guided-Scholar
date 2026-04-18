// ===== student-dashboard.js =====
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "student") {
  alert("Please log in as a student!");
  window.location.href = "index.html";
}

// Welcome message
document.getElementById("welcomeMessage").innerHTML = `Welcome, ${currentUser.firstname} ${currentUser.lastname}! 👋`;

// Courses
let enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses")) || [];
const coursesList = document.getElementById("coursesList");

function renderCourses() {
  if (!coursesList) return;
  coursesList.innerHTML = "";
  if (enrolledCourses.length === 0) {
    coursesList.innerHTML = "<p>No courses enrolled.</p>";
    return;
  }
  enrolledCourses.forEach(course => {
    const li = document.createElement("li");
    li.innerText = course;
    coursesList.appendChild(li);
  });
}

// Messages
let studentMessages = JSON.parse(localStorage.getItem("studentMessages")) || [];
const messagesList = document.getElementById("messagesList");

function renderMessages() {
  if (!messagesList) return;
  messagesList.innerHTML = "";
  if (studentMessages.length === 0) {
    messagesList.innerHTML = "<p>No new messages.</p>";
    return;
  }
  studentMessages.forEach(msg => {
    const li = document.createElement("li");
    li.innerText = msg;
    messagesList.appendChild(li);
  });
}

// Cards
function updateCards() {
  const totalCoursesCard = document.getElementById("totalCoursesCard");
  const totalBookingsCard = document.getElementById("totalBookingsCard");
  const unreadMessagesCard = document.getElementById("unreadMessagesCard");
  
  if (totalCoursesCard) totalCoursesCard.innerText = `Total Courses: ${enrolledCourses.length}`;
  if (totalBookingsCard) totalBookingsCard.innerText = `Total Bookings: 0`;
  if (unreadMessagesCard) unreadMessagesCard.innerText = `Unread Messages: ${studentMessages.length}`;
}

// Section visibility
function showSection(sectionId) {
  const sections = ["home", "courses", "messages"];
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = id === sectionId ? "block" : "none";
    }
  });
}

renderCourses();
renderMessages();
updateCards();

// Buttons
const addCourseBtn = document.getElementById("addCourseBtn");
if (addCourseBtn) {
  addCourseBtn.addEventListener("click", () => {
    const newCourse = prompt("Enter course name:");
    if (newCourse) {
      enrolledCourses.push(newCourse);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));
      renderCourses();
      updateCards();
    }
  });
}

const addMessageBtn = document.getElementById("addMessageBtn");
if (addMessageBtn) {
  addMessageBtn.addEventListener("click", () => {
    const newMessage = prompt("Enter your message:");
    if (newMessage) {
      studentMessages.push(newMessage);
      localStorage.setItem("studentMessages", JSON.stringify(studentMessages));
      renderMessages();
      updateCards();
    }
  });
}

// Initialize with home section visible
if (typeof showSection === 'function') {
  showSection("home");
}