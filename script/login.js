// console.log("Hello from js")

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (username === "admin" && password === "admin123") {
    alert("Welcome! Login Successful.");
    window.location.assign("home.html");
  } else {
    alert("Invalid credentials. Please use admin/admin123");
  }
});
