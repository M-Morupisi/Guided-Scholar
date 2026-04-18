// ===== auth.js =====

// ----- SIGNUP -----
// auth.js - Authentication logic with role-based redirects


function handleSignup(event) {
  event.preventDefault();
  
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;
  
  // Validation
  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }
  
  if (password.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }
  
  if (!role) {
    alert("Please select a role!");
    return;
  }
  
  // Create user object
  const user = {
    id: Date.now().toString(),
    firstname: firstname,
    lastname: lastname,
    email: email,
    role: role,
    fullName: `${firstname} ${lastname}`,
    createdAt: new Date().toISOString()
  };
  
  // Get existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  
  // Check if user already exists
  const userExists = users.some(u => u.email === email);
  if (userExists) {
    alert("User with this email already exists!");
    return;
  }
  
  // Add new user with password
  users.push({ ...user, password: password });
  localStorage.setItem("users", JSON.stringify(users));
  
  // Store current session (without password)
  localStorage.setItem("currentUser", JSON.stringify(user));
  
  // Show success message
  alert(`Welcome ${firstname}! Account created successfully as ${role}.`);
  
  // Close modal if it exists
  const modal = document.getElementById("signupModal");
  if (modal) {
    modal.style.display = "none";
  }
  
  // Reset form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.reset();
  }
  
  // Redirect based on role
  redirectBasedOnRole(role);
}

// Function to redirect users based on their role
function redirectBasedOnRole(role) {
  switch(role) {
    case "student":
      window.location.href = "student-dashboard.html";
      break;
    case "tutor":
      window.location.href = "tutor-dashboard.html";
      break;
    case "mentor":
      window.location.href = "mentor-dashboard.html";
      break;
    default:
      window.location.href = "index.html";
  }
}


// Login handler with role-based redirection
function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Remove password before storing in session
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
    
    alert(`Welcome back ${user.firstname}!`);
    
    // Close modal
    const modal = document.getElementById("loginModal");
    if (modal) {
      modal.style.display = "none";
    }
    
    // Reset form
    document.getElementById("loginForm").reset();
    
    // Redirect based on role
    redirectBasedOnRole(user.role);
  } else {
    alert("Invalid email or password!");
  }
}

// Function to check if user is logged in (for protected pages)
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
    return null;
  }
  return currentUser;
}

// Function to logout
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// Function to get current user
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

// ----- LOGIN -----
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid email or password!");
    return;
  }

  // Save the logged-in user
  localStorage.setItem("currentUser", JSON.stringify(user));

  // Redirect based on role
  const rolePages = {
    student: "student-dashboard.html",
    tutor: "tutor-dashboard.html",
    mentor: "mentor-dashboard.html"
  };

  if (rolePages[user.role]) {
    window.location.href = rolePages[user.role];
  } else {
    alert("Unknown role. Please contact admin.");
    window.location.href = "login.html";
  }
}

// ----- LOGOUT -----
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ----- ACCESS CONTROL -----
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Clear previous session only when visiting login or signup page
  if (path.endsWith("login.html") || path.endsWith("signup.html")) {
    localStorage.removeItem("currentUser");
  }

  // Redirect logged-in users away from login/signup
  if (currentUser && (path.endsWith("login.html") || path.endsWith("signup.html"))) {
    const rolePages = {
      student: "student-dashboard.html",
      tutor: "tutor-dashboard.html",
      mentor: "mentor-dashboard.html"
    };
    window.location.href = rolePages[currentUser.role] || "login.html";
  }

  // Protect dashboard pages
  const dashboardPages = ["student-dashboard.html", "tutor-dashboard.html", "mentor-dashboard.html"];
  if (dashboardPages.some(p => path.endsWith(p)) && !currentUser) {
    alert("Please log in first!");
    window.location.href = "login.html";
  }
});