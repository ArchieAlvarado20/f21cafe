/* Immediately check server session and restore UI */
fetch("actions/get_session.php?t=" + new Date().getTime())
  .then((r) => r.json())
  .then((data) => {
    if (data.success) {
      // Build the same structure your style.js expects:
      loggedInUser = {
        id: data.id,
        username: data.username,
        gmail: data.gmail,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1),
      };

      // Show app, hide login screen
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("app-container").style.display = "block";

      // Setup UI according to role (mirror what doLogin does)
      const ownerPanel = document.getElementById("owner_panel");
      const posView = document.getElementById("pos-screen");
      const staffNav = document.getElementById("staff_nav");

      // Initialize menu and sales like after login
      fetchSalesHistory().then(() => {
        if (loggedInUser.role === "Owner") {
          ownerPanel.style.display = "flex";
          posView.style.display = "none";
          staffNav.style.display = "none";
          switchScreen("dashboard");
        } else {
          ownerPanel.style.display = "none";
          staffNav.style.display = "block";
          posView.style.display = "block";

          name = "Laurence";

          document.getElementById("cashier_staff").textContent = name;

          switchScreen("pos");
        }
      });
    } else {
      // ensure initial state shows login
      document.getElementById("app-container").style.display = "none";
      document.getElementById("login-screen").style.display = "flex";
    }
  })
  .catch((err) => {
    console.error("Session check failed", err);
  });
