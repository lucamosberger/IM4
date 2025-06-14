// register.js
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const user_name = document.getElementById("user_name").value.trim();
    const anrede = document.getElementById("anrede").value.trim();
    const vorname = document.getElementById("vorname").value.trim();
    const nachname = document.getElementById("nachname").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ user_name, anrede, vorname, nachname, email, password }),
      });
      const result = await response.json();

      if (result.status === "success") {
        // alert("Registration successful! You can now log in.");
        window.location.href = "index.html";
      } else {
        // alert(result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("Something went wrong!");
    }
  });
