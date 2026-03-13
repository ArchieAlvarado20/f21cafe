function switchScreen(screenName) {
  // 1️⃣ Save current screen
  localStorage.setItem("activeScreen", screenName);

  // 2️⃣ Hide all screens
  document.querySelectorAll(".screen-view").forEach((view) => {
    view.style.display = "none";
  });

  // 3️⃣ Remove active class from menu
  document.querySelectorAll(".menu-link").forEach((link) => {
    link.classList.remove("active");
  });

  // 4️⃣ Show target screen
  const targetScreen = document.getElementById(`${screenName}-screen`);
  if (!targetScreen) {
    console.warn("Screen not found:", screenName);
    return;
  }
  targetScreen.style.display = "block";

  // 5️⃣ Add active class to menu link
  document.querySelectorAll(".menu-link").forEach((link) => {
    if (link.dataset.screen === screenName) link.classList.add("active");
  });

  // 6️⃣ Hide side menu on small screens
  const sideMenu = document.getElementById("side_menu");
  if (window.innerWidth <= 1024 && sideMenu) {
    sideMenu.classList.remove("visible");
  }

  // 7️⃣ Refresh/load data safely
  if (screenName === "inventory" && typeof loadInventory === "function") {
    // Fetch data first
    setupMenu().then(() => {
      // Only after data is loaded, render inventory table
      loadInventory();
    });
  } else if (screenName === "pos" && typeof searchProducts === "function") {
    setupMenu().then(() => {
      // Only after data is loaded, render inventory table
      loadInventory();
      populateFilterButtons();
      searchProducts();
    });
    filterProducts("All");
    clearInput("search_box");
  } else if (
    screenName === "withdraw" &&
    typeof searchProducts === "function"
  ) {
    setupMenuWithdraw().then(() => {
      // Only after data is loaded, render inventory table
      inventoryMain();
      populateFilterButtonsWithdraw();
      searchWithdraw();
    });
    filterWithdraw("All");
    clearInput("stock_search_box");
  } else if (screenName === "inventory-main") {
    inventoryMain();
    clearInput("inventory_search_box_main");
  } else if (screenName === "category-main") {
    loadCategoryMain();
  } else if (screenName === "dashboard") {
    (async () => {
      try {
        if (typeof fetchHistorySales === "function") {
          await fetchHistorySales();
        }

        if (typeof loadDashboard === "function") {
          loadDashboard();
          loadInventory();
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    })();
  } else if (
    screenName === "sales" &&
    typeof fetchSalesHistory === "function"
  ) {
    fetchSalesHistory()
      .then(() => {
        if (typeof loadSales === "function") (loadSales(), setupMenu());
      })
      .catch((err) => {
        console.error("Failed to fetch sales data:", err);
        if (typeof loadSales === "function") loadSales([]);
      });
  }
}

window.addEventListener("load", () => {
  const lastScreen = localStorage.getItem("activeScreen") || "dashboard";
  switchScreen(lastScreen);
});
