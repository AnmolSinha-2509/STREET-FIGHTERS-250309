document.addEventListener("DOMContentLoaded", () => {
  const profileIcon = document.querySelector(".profile-icon");

  if (!window.netlifyIdentity) return;

  // Init event
  window.netlifyIdentity.on("init", (user) => {
    updateProfile(user);
  });

  // Login event
  window.netlifyIdentity.on("login", (user) => {
    updateProfile(user);
  });

  // Logout event
  window.netlifyIdentity.on("logout", () => {
    updateProfile(null);
  });

  // Profile icon click handler
  profileIcon.addEventListener("click", () => {
    const user = netlifyIdentity.currentUser();
    if (user) {
      window.location.href = "profile.html"; // agar logged in hai to profile le jao
    } else {
      netlifyIdentity.open(); // agar login nahi hai to login popup khol do
    }
  });

  // Update profile icon state
  function updateProfile(user) {
    if (user) {
      profileIcon.classList.add("logged-in");
      profileIcon.title = user.user_metadata.full_name || "Profile";
    } else {
      profileIcon.classList.remove("logged-in");
      profileIcon.title = "Login / Signup";
    }
  }
});