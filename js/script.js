let activeCategory = "All";
let activeCategoryWithdraw = "All";
let orderList = [];
let orderListWithdraw = [];
let transactionHistory = [];

let loggedInUser = null;
let menuItems = {};
let nextId = 1;

let selectedCategory = "";

let allInventoryItems = [];
let inventorySelectedCategory = "";

allInventoryItemsMain = [];

let archivedItems = [];
let archivedSelectedCategory = "";

let productItems = [];
let productSelectedCategory = "";

let storedPayment = 0;

let productLineChart = null;

let noItemCount = 0;

// Product icons
const icons = {
  1: "🥗",
  2: "🥗",
  3: "🥗",
  4: "🍟",
  5: "🥓",
  6: "🧀",
  7: "🍗",
  8: "🧇",
  9: "🧇",
  10: "🧇",
  11: "🍝",
  12: "🍝",
  13: "🍝",
  14: "🍝",
  15: "🍝",
  16: "🥪",
  17: "🥪",
  18: "🥪",
  19: "🥪",
  20: "🥪",
  21: "🌭",
  22: "🥪",
  23: "🍰",
  24: "🍰",
  25: "🍰",
  26: "🍰",
  27: "🍰",
  28: "☕",
  29: "☕",
  30: "☕",
  31: "☕",
  32: "☕",
  33: "☕",
  34: "🥤",
  35: "🥤",
  36: "🥤",
  37: "🥤",
  38: "🥤",
  39: "🥤",
  40: "🍫",
  41: "🧃",
  42: "🧃",
  43: "🧃",
  44: "🧃",
  45: "🧃",
  46: "🥛",
  47: "🍵",
  48: "🥛",
  49: "🥤",
  50: "🍵",
  51: "🍵",
  52: "🍵",
  53: "☕",
};

function getIcon(itemId) {
  return icons[itemId] || "🍽️";
}

function findItem(itemId) {
  for (const cat in menuItems) {
    const found = menuItems[cat].find((i) => Number(i.id) === Number(itemId));
    if (found) return found;
  }
  return null;
}

// Get all items as flat array
function getAllItems() {
  return Object.values(menuItems).flat();
}

// NEW FUNCTION: Fetch Sales History from Database
function fetchSalesHistory() {
  return fetch("actions/get_sales.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      transactionHistory = data
        .filter((row) => row.date_time.startsWith(today))
        .map((row) => ({
          id: row.id,
          date: row.date_time,
          items: row.items,
          total: row.total,
          payment: row.payment,
        }));

      return true;
    })
    .catch((error) => {
      console.error("Error loading sales:", error);
    });
}

function toggleMenu() {
  const menu = document.getElementById("side_menu");
  menu.classList.toggle("minimized");
  const posScreen = document.getElementById("pos-screen");
  if (window.innerWidth > 1024) {
    posScreen.style.marginLeft = menu.classList.contains("minimized")
      ? "80px"
      : "260px";
  } else {
    posScreen.style.marginLeft = "0";
  }
}
function toggleMobileMenu() {
  document.getElementById("side_menu").classList.toggle("visible");
}

// Login function
function doLogin() {
  const username = document.getElementById("user_name").value.trim();
  const password = document.getElementById("pass_word").value.trim();
  const msgBox = document.getElementById("login_msg");

  if (!username || !password) {
    msgBox.textContent = "Please enter both username and password.";
    return;
  }

  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  fetch("actions/login.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const normalizedRole =
          data.role.charAt(0).toUpperCase() + data.role.slice(1);

        loggedInUser = {
          id: data.id,
          username: username,
          role: normalizedRole,
        };

        msgBox.textContent = "";
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("app-container").style.display = "block";

        const ownerPanel = document.getElementById("owner_panel");
        const posView = document.getElementById("pos-screen");
        const staffNav = document.getElementById("staff_nav");

        // Load menu and sales history upon login
        setupMenu();
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

            if (loggedInUser.username == "staff") {
              staff = "Laurence";

              document.getElementById("cashier_staff").textContent = staff;
            } else {
              staff = "Paul";

              document.getElementById("cashier_staff").textContent = staff;
            }

            switchScreen("pos");
          }
        });

        document.getElementById("user_name").value = "";
        document.getElementById("pass_word").value = "";
        refreshCart();
      } else {
        msgBox.textContent = data.message || "Invalid username or password.";
      }
    })
    .catch((error) => {
      console.error("Login Error:", error);
      msgBox.textContent = "An error occurred. Please try again.";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameField = document.getElementById("user_name");
  const passwordField = document.getElementById("pass_word");
  [usernameField, passwordField].forEach((field) => {
    field.addEventListener("keypress", (e) => {
      if (e.key === "Enter") doLogin();
    });
  });
});

function doLogout() {
  fetch("actions/logout.php", {
    method: "POST",
    credentials: "include", // IMPORTANT: para masama ang session cookie
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // reset frontend state
        loggedInUser = null;
        orderList = [];
        activeCategory = "All";
        transactionHistory = [];

        document.getElementById("app-container").style.display = "none";
        document.getElementById("login-screen").style.display = "flex";
      } else {
        alert("Logout failed");
      }
    })
    .catch((err) => {
      console.error("Logout error:", err);
    });
}

function loadSales() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;
  const salesTable = document.getElementById("sales_list");

  if (transactionHistory.length === 0) {
    salesTable.innerHTML =
      '<tr><td colspan="4" class="placeholder-text">No sales transactions found in database</td></tr>';
  } else {
    salesTable.innerHTML = transactionHistory
      .map(
        (t) => `
            <tr>
                <td>${t.date}</td>
                <td>${t.items}</td>
                <td>${t.payment}</td>
                <td style="font-weight: 700; color: #000000;">₱${t.total.toFixed(
                  2,
                )}</td>
            </tr>
        `,
      )
      .join("");
  }
}

function filterProducts(category, btn) {
  activeCategory = category;
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  else {
    const defaultBtn = document.querySelector(
      `.filter-btn[onclick*="${category}"]`,
    );
    if (defaultBtn) defaultBtn.classList.add("active");
  }
  searchProducts();
}

// search inventory
function handleSearch(input) {
  const searchText = input.value.toLowerCase();

  if (input.id === "search_box") {
    searchProductsByName(searchText);
  }

  if (input.id === "stock_search_box") {
    searchStockByName(searchText);
  }

  if (input.id === "archived_search_box") {
    searchArchivedByName(searchText);
  }

  if (input.id === "archived_search_box_main") {
    searchArchivedByNameMain(searchText);
  }

  if (input.id === "inventory_search_box_main") {
    searchInventoryByNameMain(searchText);
  }

  if (input.id === "search_inventory_name") {
    searchInventoryByName(searchText);
  }

  if (input.id === "search_product_name") {
    searchProductByName(searchText);
  }
}

function clearInput(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.value = "";
  }
}

function searchProducts() {
  const productArea = document.getElementById("products_list");
  productArea.innerHTML = "";
  const searchText = document.getElementById("search_box").value.toLowerCase();

  let filtered = getAllItems().filter((item) => {
    const catMatch =
      activeCategory === "All" || item.category === activeCategory;
    const nameMatch = item.name.toLowerCase().includes(searchText);
    return catMatch && nameMatch;
  });

  if (filtered.length === 0) {
    productArea.innerHTML =
      '<p class="placeholder-text">No items found matching your search.</p>';
    return;
  }

  filtered.forEach((item) => {
    const outOfStock = item.stock <= 0;
    const lowStock = item.stock > 0 && item.stock <= 5;

    const card = document.createElement("div");
    card.className = `product-card ${outOfStock ? "unavailable" : ""}`;
    card.setAttribute("data-id", item.id);

    if (!outOfStock) {
      card.setAttribute("onclick", `addToOrder(${item.id})`);
    }

    card.innerHTML = `
            <div class="product-icon">${getIcon(item.id)}</div>
            <div class="product-info">
                <strong>${item.name}</strong>
                <span class="stock-info ${lowStock ? "warning" : ""}">
                    ${
                      outOfStock
                        ? "🚫 NO READY ITEMS"
                        : lowStock
                          ? `⚠️ Only ${item.stock} left`
                          : `${item.category}`
                    }
                </span>
            </div>
            <div class="product-cost">₱${Number(item.price || 0).toFixed(2)}</div>
        `;
    productArea.appendChild(card);
  });
}

function addToOrder(itemId) {
  const product = findItem(itemId);
  if (!product) {
    showNotification("Error: Item not found.", "alert-danger");
    return;
  }
  if (product.stock <= 0) {
    showNotification(`${product.name} is out of stock.`, "alert-danger");
    return;
  }
  const existing = orderList.find((i) => i.id === itemId);
  if (existing) {
    const newQty = existing.qty + 1;
    if (newQty > product.stock) {
      showNotification(
        `Not enough stock for ${product.name}. Only ${product.stock} available.`,
        "alert-danger",
      );
      return;
    }
    existing.qty += 1;
  } else {
    orderList.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
      category: product.category,
    });
  }
  showNotification(`${product.name} added to cart!`, "alert-success");
  refreshCart();
}

function changeQuantity(itemId, delta) {
  const orderItem = orderList.find((i) => i.id === itemId);
  const product = findItem(itemId);
  if (orderItem) {
    const updatedQty = orderItem.qty + delta;
    if (updatedQty > 0) {
      if (delta > 0 && updatedQty > product.stock) {
        showNotification(
          `Cannot add more ${orderItem.name}. Only ${product.stock} available.`,
          "alert-danger",
        );
        return;
      }
      orderItem.qty = updatedQty;
    } else {
      orderList = orderList.filter((i) => i.id !== itemId);
    }
    refreshCart();
    document.getElementById("notification").innerHTML = "";
  }
}

function refreshCart() {
  document.getElementById("checkout_btn").textContent = "Place Order";
  const cartArea = document.getElementById("order_items");
  const totalDisplay = document.getElementById("order_total");
  const cashInput = document.getElementById("cash_received");
  let sum = 0;
  if (orderList.length === 0) {
    cartArea.innerHTML = '<p class="placeholder-text">Cart is empty.</p>';
    totalDisplay.textContent = "₱0.00";
    cashInput.readOnly = true;
    cashInput.value = "";
    return;
  }
  let html = "";
  orderList.forEach((item) => {
    cashInput.readOnly = false;
    const lineTotal = item.price * item.qty;
    sum += lineTotal;
    html += `
            <div class="order-line">
                <div class="line-details">
                    <span class="item-title" title="${item.name}">${
                      item.name
                    }</span>
                    <div class="qty-controls">
                        <button class="qty-btn" onclick="changeQuantity(${
                          item.id
                        }, -1)">−</button>
                        <span class="qty-amount">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQuantity(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
                <span class="line-cost">₱${lineTotal.toFixed(2)}</span>
            </div>
        `;
  });
  cartArea.innerHTML = html;
  totalDisplay.textContent = `₱${sum.toFixed(2)}`;
}

function emptyCart() {
  if (orderList.length === 0) {
    showNotification("Cart is already empty.", "alert-danger");
    return;
  }
  Swal.fire({
    title: "Clear Cart...",
    text: "Are you sure you want to clear the cart?",
    theme: "light",
    showCancelButton: true,
    confirmButtonColor: "#070000ff",
    cancelButtonColor: "rgba(8, 0, 0, 1)",
    confirmButtonText: "Yes, Clear it!",
  }).then((result) => {
    if (result.isConfirmed) {
      orderList = [];
      refreshCart();
    }
  });
}

function processCheckout() {
  const cash = parseFloat(document.getElementById("cash_received").value) || 0;
  const paymentType = document.getElementById("payment_type").value;

  storedPayment = cash;

  if (orderList.length === 0) {
    showNotification("Cannot checkout an empty cart.", "alert-danger");
    return;
  }
  if (cash == "" && paymentType === "Cash") {
    showNotification("Cannot checkout an empty payment.", "alert-danger");
    return;
  }

  if (paymentType === "Cash") {
    paymentAmount =
      parseFloat(document.getElementById("cash_received").value) || 0;
  }

  // Calculate total
  const grandTotal = orderList.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  // Check stock locally first
  for (const orderItem of orderList) {
    const product = findItem(orderItem.id);
    if (orderItem.qty > product.stock) {
      showNotification(
        `Checkout failed! Not enough stock for ${orderItem.name}. Available: ${product.stock}`,
        "alert-danger",
      );
      return;
    }
  }

  // Prepare data for backend
  const orderData = {
    items: orderList,
    payment_method: paymentType,
    total: grandTotal,
  };

  // Send to PHP
  fetch("actions/process_order.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const checkoutBtn = document.getElementById("checkout_btn");
        const search_box = document.getElementById("search_box");
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Placing Order...";
        search_box.value = "";

        // auto-enable after 2 seconds
        setTimeout(() => {
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = "Place Order";
        }, 2000);

        // Update local UI only after successful database save
        for (const orderItem of orderList) {
          const product = findItem(orderItem.id);
          product.stock -= orderItem.qty;
        }

        // --- IMPORTANT: Instead of manually pushing, we fetch fresh data from DB ---
        fetchSalesHistory().then(() => {
          document.getElementById("cash_change").textContent = "₱0.00";
          document.getElementById("cash_received").value = "";
          showNotification(
            "Order saved to database successfully!",
            "alert-success",
          );
          fetchSales();
          activeCategory = "All";
          filterProducts("All");
          const allBtn = Array.from(
            document.querySelectorAll(".filter-btn"),
          ).find((btn) => btn.textContent === "All");

          if (allBtn) allBtn.classList.add("active");

          if (loggedInUser.role === "Staff" || loggedInUser.role === "Owner") {
            displayReceipt(orderList, grandTotal, paymentType);
          }

          orderList = [];
          refreshCart();
          searchProducts(); // Refreshes UI stock display

          if (loggedInUser.role === "Owner") loadDashboard();
        });
      } else {
        showNotification("Database Error: " + data.message, "alert-danger");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification("Connection error. Please try again.", "alert-danger");
    });
}

function displayReceipt(items, total, payment) {
  const timeField = document.getElementById("receipt_time");
  const linesArea = document.getElementById("receipt_lines");
  const subField = document.getElementById("receipt_sub");
  const totalField = document.getElementById("receipt_total");
  const paymentField = document.getElementById("receipt_payment");
  const changeField = document.getElementById("receipt_change");
  const methodField = document.getElementById("receipt_method");

  timeField.textContent = new Date().toLocaleString();
  subField.textContent = `₱${total.toFixed(2)}`;
  totalField.textContent = `₱${total.toFixed(2)}`;
  paymentField.textContent = `₱${storedPayment.toFixed(2)}`;
  changeField.textContent = `₱${storedPayment.toFixed(2) - total.toFixed(2)}`;
  methodField.textContent = payment;

  if (loggedInUser.role === "Owner") {
    staff = "Yhaj";
  } else if (loggedInUser.username == "staff") {
    staff = "Laurence";
  } else if (loggedInUser.username == "user") {
    staff = "Paul";
  }
  // Show logged in user
  document.getElementById("cashier").textContent = staff;

  const VAT_RATE = 0.12;

  // 🔢 VAT computation (VAT-inclusive pricing)
  const vatableSales = total / (1 + VAT_RATE);
  const vatAmount = total - vatableSales;

  document.getElementById("receipt_vatable").textContent =
    `₱${vatableSales.toFixed(2)}`;
  document.getElementById("receipt_vat").textContent = `₱${vatAmount.toFixed(
    2,
  )}`;

  if (payment !== "Cash") {
    // 🔥 NON-CASH → HIDE
    document.getElementById("receipt_payment_row").style.display = "none";
    document.getElementById("receipt_change_row").style.display = "none";
  } else {
    document.getElementById("receipt_payment_row").style.display = "flex";
    document.getElementById("receipt_change_row").style.display = "flex";
  }

  linesArea.innerHTML = items
    .map(
      (item) => `
        <div class="receipt-line">
            <span class="line-name">${item.name}</span>
            <span class="line-qty">x${item.qty}</span>
            <span class="line-price">₱${(item.price * item.qty).toFixed(
              2,
            )}</span>
        </div>
    `,
    )
    .join("");
  document.getElementById("receipt_modal").classList.add("show");
}

function hideReceipt() {
  document.getElementById("receipt_modal").classList.remove("show");
}
function doPrint() {
  window.print();
}

function showNotification(msg, type) {
  const notifBox = document.getElementById("notification");
  notifBox.textContent = msg;
  notifBox.className = `alert ${type}`;
  setTimeout(() => {
    notifBox.textContent = "";
    notifBox.className = "alert";
  }, 4000);
}

window.onclick = function (e) {
  if (
    e.target.classList.contains("popup") ||
    e.target.classList.contains("receipt-popup")
  ) {
    e.target.classList.remove("show");
  }
};

//Archived Modal

//archived filter by Name
function searchArchivedByName(searchText) {
  const table = document.getElementById("archived_list");
  table.innerHTML = "";

  let filtered = archivedItems.filter((item) =>
    item.name.toLowerCase().includes(searchText),
  );

  if (archivedSelectedCategory !== "") {
    filtered = filtered.filter(
      (item) => item.category === archivedSelectedCategory,
    );
  }

  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:#888;">
          No archived items found
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>₱${parseFloat(item.price).toFixed(2)}</td>
      <td>${item.deleted_at}</td>
      <td>
        <button class="delete-btn" onclick="restoreItem(${item.id})">
          Restore
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

//archived filter by Category
function applyArchivedCategoryFilter() {
  archivedSelectedCategory = document.getElementById(
    "archived_category_filter",
  ).value;

  loadArchivedItems();
}

function showAddModalArchived() {
  document.getElementById("popup_titles").textContent = "Archived Items";
  document.getElementById("archived_modal").classList.add("show");

  fetch("actions/get_deleted.php")
    .then((response) => response.json())
    .then((data) => {
      archivedItems = data;

      populateArchivedCategoryFilter(data);

      // default = All
      archivedSelectedCategory = "";
      document.getElementById("archived_category_filter").value = "";

      loadArchivedItems();
    })
    .catch((error) => {
      console.error("Error fetching deleted items:", error);
    });
}

function hideModalArchived() {
  document.getElementById("archived_modal").classList.remove("show");
}

function loadArchivedItems() {
  const table = document.getElementById("archived_list");
  table.innerHTML = "";

  let allItems = archivedItems;

  if (allItems && allItems.length > 0) {
    allItems.sort((a, b) => b.id - a.id);
  }

  if (archivedSelectedCategory !== "") {
    allItems = allItems.filter(
      (item) => item.category === archivedSelectedCategory,
    );
  }

  if (allItems.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:#888;">
          No archived items found
        </td>
      </tr>
    `;
    return;
  }

  allItems.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>₱${parseFloat(item.price).toFixed(2)}</td>
      <td>${item.deleted_at}</td>
      <td>
        <button class="delete-btn" onclick="restoreItem(${item.id})">
          Restore
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

function populateArchivedCategoryFilter(data) {
  const select = document.getElementById("archived_category_filter");
  select.innerHTML = `<option value="">All Categories</option>`;

  const categories = [...new Set(data.map((item) => item.category))];

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

// restore

function restoreItem(itemId) {
  document.getElementById("archived_modal").classList.remove("show");
  Swal.fire({
    text: "Successfully Restored!",
    icon: "success",
    confirmButtonColor: "#070000ff",
    timer: 2500,
  }).then((result) => {
    const formData = new FormData();
    formData.append("id", itemId);
    formData.append("status", ""); // 👈 return to active
    formData.append("deleted_at", ""); // 👈 clear deleted timestamp

    fetch("actions/delete_item.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotification("Item restored successfully!", "alert-success");

          setupMenu().then(() => {
            loadInventory();
            loadArchivedItems(); // OPTIONAL: refresh archived modal
          });
        } else {
          showNotification("Error: " + data.message, "alert-danger");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("Failed to restore item.", "alert-danger");
      });
  });
}
//Payment Cash
function handlePaymentMethod() {
  const method = document.getElementById("payment_type").value;
  const cashSection = document.getElementById("cash_section");

  if (method === "Cash") {
    cashSection.style.display = "block";
  } else {
    cashSection.style.display = "none";

    // reset values kapag hindi cash
    document.getElementById("cash_received").value = "";
    document.getElementById("cash_change").textContent = "₱0.00";
  }
}

document.addEventListener("input", function (e) {
  if (e.target.id !== "cash_received") return;

  const cash = parseFloat(e.target.value) || 0;
  const totalText = document.getElementById("order_total").textContent;
  const total = parseFloat(totalText.replace("₱", "")) || 0;

  const change = cash - total;

  document.getElementById("cash_change").textContent =
    "₱" + (change > 0 ? change.toFixed(2) : "0.00");
});

//payment input btn disabled
function updateCashComputation() {
  const paymentType = document.getElementById("payment_type").value;
  const checkoutBtn = document.getElementById("checkout_btn");

  // default: enabled
  checkoutBtn.disabled = false;

  if (paymentType !== "Cash") {
    document.getElementById("cash_change").textContent = "₱0.00";
    return;
  }

  const cash = parseFloat(document.getElementById("cash_received").value) || 0;
  const total =
    parseFloat(
      document.getElementById("order_total").textContent.replace("₱", ""),
    ) || 0;

  const change = cash - total;

  document.getElementById("cash_change").textContent =
    "₱" + (change > 0 ? change.toFixed(2) : "0.00");

  // 🔥 DISABLE CHECKOUT KAPAG KULANG
  if (cash < total) {
    showNotification("Please put rigth amount", "alert-danger");
    checkoutBtn.disabled = true;
  } else {
    showNotification("Payment is ready!", "alert-success");
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const cashInput = document.getElementById("cash_received");

  // 🔒 lock at start (walang orderList)
  if (orderList.length === 0) {
    cashInput.readOnly = true;
    cashInput.value = "";
  } else {
    cashInput.readOnly = false;
    cashInput.value = "";
  }
});

// bar graph data
let salesChart;
let allSales = [];

// Fetch sales from PHP
function fetchSales() {
  fetch("actions/get_sales.php") // 👈 ito yung PHP mo
    .then((res) => res.json())
    .then((data) => {
      allSales = data;
      updateSalesChart(); // initial load
    })
    .catch((err) => console.error(err));
}

// Update chart based on dropdown
function updateSalesChart() {
  const filter = document.getElementById("salesFilter").value;
  const filteredData = filterSalesData(filter);

  const labels = filteredData.map((item) => item.label);
  const totals = filteredData.map((item) => item.total);

  // 🎨 color palette
  const colors = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
    "#20c997",
    "#fd7e14",
    "#6f42c1",
    "#d63384",
  ];

  const dynamicColors = labels.map((_, i) => colors[i % colors.length]);

  // 🟢 Create ONCE
  if (!salesChart) {
    const ctx = document.getElementById("salesChart").getContext("2d");

    salesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sales (₱)", // ✅ Legend text
            data: totals,
            backgroundColor: dynamicColors, // ✅ different colors
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true, // ✅ show legend
            position: "bottom",
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return;
  }

  // 🟢 Update only (NO destroy)
  salesChart.data.labels = labels;
  salesChart.data.datasets[0].data = totals;
  salesChart.data.datasets[0].backgroundColor = dynamicColors; // ✅ update colors
  salesChart.update();
}

function toPHDate(dateString) {
  return new Date(
    new Date(dateString).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    }),
  );
}

// Filter logic
function filterSalesData(type) {
  const now = toPHDate(new Date());
  let map = {};

  allSales.forEach((sale) => {
    const saleDate = toPHDate(sale.date_time);
    let key = "";
    let order = 0;

    // 🕒 TODAY → hourly (PH time)
    if (type === "day") {
      if (saleDate.toDateString() !== now.toDateString()) return;

      const hour = saleDate.getHours(); // PH hour
      const displayHour = hour % 12 || 12;
      const suffix = hour < 12 ? "AM" : "PM";

      key = `${displayHour}${suffix}`;
      order = hour; // 0–23 (correct order)
    }

    // 📅 WEEK → Sun–Sat (PH)
    if (type === "week") {
      // Start of current week (Sunday)
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(now.getDate() - now.getDay());

      // End of week (Saturday)
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      if (saleDate < start || saleDate > end) return;

      order = saleDate.getDay(); // 0–6
      key = saleDate.toLocaleDateString("en-PH", {
        weekday: "short",
        timeZone: "Asia/Manila",
      });
    }

    // 🗓️ MONTH → Week 1–4 (PH)
    if (type === "month") {
      if (
        saleDate.getMonth() !== now.getMonth() ||
        saleDate.getFullYear() !== now.getFullYear()
      )
        return;

      order = Math.ceil(saleDate.getDate() / 7);
      key = `Week ${order}`;
    }

    // 📆 YEAR → Jan–Dec (PH)
    if (type === "year") {
      if (saleDate.getFullYear() !== now.getFullYear()) return;

      order = saleDate.getMonth(); // 0–11
      key = saleDate.toLocaleDateString("en-PH", {
        month: "short",
        timeZone: "Asia/Manila",
      });
    }

    // 📆 ANNUAL → 2020–2025 (per year)
    if (type === "annual") {
      const year = saleDate.getFullYear();

      if (year < 2020 || year > 2027) return;

      key = year.toString(); // label will be 2020, 2021...
      order = year; // ensures correct sorting
    }

    // 📊 QUARTERLY → 2020–2026 (Q1–Q4 per year)
    if (type === "quarterly") {
      const year = saleDate.getFullYear();

      if (year < 2020 || year > 2026) return;

      const month = saleDate.getMonth(); // 0–11
      const quarter = Math.floor(month / 3) + 1; // 1–4

      key = `${year} Q${quarter}`;

      // ensures correct chronological sorting
      order = year * 10 + quarter;
    }

    if (!map[key]) {
      map[key] = { label: key, total: 0, order };
    }

    map[key].total += sale.total;
  });

  // 🔥 OLDEST → LATEST (correct order)
  return Object.values(map)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      label: item.label,
      total: item.total,
    }));
}

// Load on page open
document.addEventListener("DOMContentLoaded", fetchSales);

// sales report
function show_daily_Sales() {
  document.getElementById("salesDiv").style.display = "block";
  document.getElementById("productDiv").style.display = "none";
}

function show_product_Sales() {
  document.getElementById("salesDiv").style.display = "none";
  document.getElementById("productDiv").style.display = "block";

  fetch("actions/get_inventory.php")
    .then((response) => response.json())
    .then((data) => {
      loadProductReports(data);
    })
    .catch((error) => {
      console.error("Error fetching deleted items:", error);
    });
}

//Product Reports
// filter product by name
let productSearchText = "";

function searchProductByName(text) {
  productSearchText = text;
  loadProductReports();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu().then(() => {
    const select = document.getElementById("product_filter");

    // Force dropdown to select “all”
    select.value = "";

    // Trigger your category change logic
    select.dispatchEvent(new Event("change"));
  });
});

//product reports filter by Category
function applyProductFilter() {
  productSelectedCategory = document.getElementById("product_filter").value;
  loadProductReports();
}

function loadProductReports() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  const table = document.getElementById("product_report");
  table.innerHTML = "";

  let allItems = allInventoryItems;

  if (allItems && allItems.length > 0) {
    allItems = [...allItems].sort((a, b) => b.id - a.id);
  }

  if (productSelectedCategory !== "") {
    allItems = allItems.filter(
      (item) => item.category === productSelectedCategory,
    );
  }

  // ✅ FILTER BY NAME (SEARCH)
  if (productSearchText !== "") {
    allItems = allItems.filter((item) =>
      item.name.toLowerCase().includes(productSearchText),
    );
  }

  if (allItems.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:#888;">
          No inventory data available
        </td>
       </tr>
    `;
    return;
  }

  allItems.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td>
        <button class="edit-btn" onclick="showProductReportModal(${
          item.id
        })">Sales</button> 
      </td>
    `;
    table.appendChild(row);
  });
}

function populateProductReportCategoryFilter(data) {
  const select = document.getElementById("product_filter");

  // tandaan yung kasalukuyang pinili
  const currentValue = select.value;

  // reset select options
  select.innerHTML = `<option value="">All Categories</option>`;

  // get unique categories at i-sort alphabetically
  const categories = [...new Set(data.map((item) => item.category))].sort();

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });

  // restore selected value kung valid pa
  if (currentValue && categories.includes(currentValue)) {
    select.value = currentValue;
  }
}

function openSalesReportModal() {
  document.getElementById("product-sales-modal").classList.add("show");
}

// Modal for product report(Sales and sold)
async function showProductReportModal(itemId) {
  const modal = document.getElementById("product_report_modal");
  const title = document.getElementById("popup_titles");

  title.textContent = "Product Sales Report";
  modal.classList.add("show");

  try {
    // 📋 TABLE DATA (summary)
    const tableRes = await fetch("actions/get_product_report.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });

    const tableData = await tableRes.json();
    loadProductStatus(tableData);
  } catch (err) {
    console.error("Table error:", err);
  }

  try {
    // 📈 LINE CHART DATA (trend)
    const chartRes = await fetch("actions/get_product_chart.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item_id: itemId }),
    });

    const chartData = await chartRes.json();
    renderProductLineChart(chartData);
  } catch (err) {
    console.error("Chart error:", err);
  }
}

function hideModalProductReport() {
  document.getElementById("product_report_modal").classList.remove("show");
}
// populate product report
function loadProductStatus(data) {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  const table = document.getElementById("product-reports");

  if (!data || data.length === 0) {
    hideModalProductReport();
    Swal.fire({
      text: "No Available Data!",
      icon: "error",
      confirmButtonColor: "#070000ff",
      timer: 2500,
    });
  }

  table.innerHTML = data
    .map(
      (r) => `
  <tr>
    <td>${r.item_name}</td>
    <td>${r.price}</td>
    <td>₱${Number(r.total_sales).toFixed(2)}</td>
    <td>${r.sold_qty}</td>
    <td>Jan(2026) - Dec(2026)</td>
  </tr>
`,
    )
    .join("");
}

function renderProductLineChart(data) {
  const labels = data.map((r) => formatShortDate(r.sale_day));
  const sales = data.map((r) => Number(r.total_sales));

  const ctx = document.getElementById("productLineChart").getContext("2d");

  // create once
  if (!productLineChart) {
    productLineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Daily Sales (₱)",
            data: sales,
            borderColor: "#000",
            backgroundColor: "rgba(241, 236, 236, 0.15)",
            fill: true,
            tension: 0.3,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    return;
  }

  // update only
  productLineChart.data.labels = labels;
  productLineChart.data.datasets[0].data = sales;
  productLineChart.update();
}

function formatShortDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
  });
}
function populateFilterButtons() {
  const container = document.getElementById("filter_buttons");
  container.innerHTML = "";

  const items = getAllItems();

  // get unique categories
  const categories = [...new Set(items.map((item) => item.category))].sort();

  // 👉 Always add ALL button first
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.textContent = "All";
  allBtn.onclick = function () {
    filterProducts("All", this);
  };
  container.appendChild(allBtn);

  // 👉 Add category buttons
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat;
    btn.onclick = function () {
      filterProducts(cat, this);
    };
    container.appendChild(btn);
  });
}
function dashboardActiveBtn(activeId) {
  const buttons = document.querySelectorAll(".dashboard-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));

  document.getElementById(activeId).classList.add("active");
}

function showSales() {
  document.getElementById("show-dashboard").style.display = "block";
  document.getElementById("show-cost").style.display = "none";
  document.getElementById("show-dashboard-profit").style.display = "none";
  dashboardActiveBtn("btn-sales");

  fetchSalesHistory().then(() => {
    loadDashboard();
    loadInventory();
  });
}

function showCost() {
  document.getElementById("show-cost").style.display = "block";
  document.getElementById("show-dashboard").style.display = "none";
  document.getElementById("show-dashboard-profit").style.display = "none";

  dashboardActiveBtn("btn-costs");

  fetchSalesHistoryCost().then(() => {
    loadDashboardCost();
    inventoryMain();
  });
}

function showProfit() {
  document.getElementById("show-dashboard-profit").style.display = "block";
  document.getElementById("show-dashboard").style.display = "none";
  document.getElementById("show-cost").style.display = "none";
  dashboardActiveBtn("btn-profit");

  updateProfitChart();

  document.getElementById("low_stock_count").textContent = noItemCount;

  const profit = computeTodayProfit();

  document.getElementById("todayProfit").textContent = "₱" + profit.toFixed(2);
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}
