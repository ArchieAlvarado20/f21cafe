function searchWithdraw() {
  const productArea = document.getElementById("stock_list");
  productArea.innerHTML = "";
  const searchText = document
    .getElementById("stock_search_box")
    .value.toLowerCase();

  let filtered = getAllItems().filter((item) => {
    const catMatch =
      activeCategoryWithdraw === "All" ||
      item.category === activeCategoryWithdraw;
    const nameMatch = item.name.toLowerCase().includes(searchText);
    return catMatch && nameMatch;
  });

  if (filtered.length === 0) {
    productArea.innerHTML =
      '<p class="placeholder-text">No items found matching your search.</p>';
    return;
  }

  filtered.forEach((item) => {
    const outOfStock = item.qty <= 0;
    const lowStock = item.qty > 0 && item.qty <= 5;

    const card = document.createElement("div");
    card.className = `product-card ${outOfStock ? "unavailable" : ""}`;
    card.setAttribute("data-id", item.id);

    if (!outOfStock) {
      card.setAttribute("onclick", `addToOrderWithdraw(${item.id})`);
    }

    const expiryColor = getExpiryColor(item.expiry_date);

    card.innerHTML = `
             <div class="product-info">
                    <strong>${item.name}</strong>
                    <span class="stock-info">
                     ${item.category}
                    </span>
                </div>

            <div class="product-info">
                <strong>
                  ${item.batch_no}
                </strong>
                <span class="stock-info">
                    Batch Number
                </span>
            </div>
              <div class="product-info">
                  <strong class="stock-info ${lowStock ? "warning" : ""}">
                        ${
                          outOfStock
                            ? "🚫 OUT OF STOCK"
                            : lowStock
                              ? `⚠️ Only ${item.qty} left`
                              : `${item.qty}`
                        }
                    </strong>
                    <span class="stock-info">
                        Quantity
                    </span>
                </div>

                  <div class="product-info">
                      <strong>
                      ₱${Number(item.stock_price || 0).toFixed(2)}
                      </strong>
                      <span class="stock-info">
                          Cost/PCS
                      </span>
                  </div>
              <div class="product-info">
                <strong>
                  ${new Date(item.expiry_date).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </strong>
                <span class="stock-info">
                    Expiration Date
                </span>
            </div>
                <div class="product-icon"
                    style="background-color:${expiryColor.color}; font-size:10px;">
                  <span style="font-weight:bold; display:block; text-align:center;">
                      ${expiryColor.label}
                    </span>
                </div>
        `;
    productArea.appendChild(card);
  });
}
function getExpiryColor(expiryDate) {
  if (!expiryDate) return { color: "gray", label: "No expiry" };

  const dateOnly = expiryDate.split(" ")[0];

  const today = new Date();
  const expiry = new Date(dateOnly);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let color = "#39aa00"; // default green
  let label = `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;

  if (diffDays < 0) {
    color = "#5c5e5cd2";
    label = "EXPIRED";
  } else if (diffDays === 0) {
    color = "#5c5e5cd2";
    label = "Expires today";
  } else if (diffDays <= 7) {
    color = "#d30909"; // urgent
  } else if (diffDays <= 30) {
    color = "#fad70e"; // warning
  }

  return { color, label };
}
// Setup menu by fetching from Database
function setupMenuWithdraw() {
  return fetch("actions/get_withdraw-panel.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      selectedCategoryMain = data;
      menuItems = {};

      data.forEach((item) => {
        if (!menuItems[item.category]) {
          menuItems[item.category] = [];
        }
        menuItems[item.category].push(item);
      });

      const allIds = data.map((i) => i.id);
      if (allIds.length > 0) {
        nextId = Math.max(...allIds) + 1;
      }

      searchWithdraw(selectedCategoryMain);
      return true;
    })

    .catch((error) => {
      console.error("Error loading inventory:", error);
      const productArea = document.getElementById("stock_list");
      if (productArea) {
        productArea.innerHTML =
          '<p class="placeholder-text" style="color:red;">Error loading menu from database.</p>';
      }
    });
}

function populateFilterButtonsWithdraw() {
  const container = document.getElementById("filter_buttons_withdraw");
  container.innerHTML = "";

  const items = getAllItems();

  // get unique categories
  const categories = [...new Set(items.map((item) => item.category))].sort();

  // 👉 Always add ALL button first
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.textContent = "All";
  allBtn.onclick = function () {
    filterWithdraw("All", this);
  };
  container.appendChild(allBtn);

  // 👉 Add category buttons
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.textContent = cat;
    btn.onclick = function () {
      filterWithdraw(cat, this);
    };
    container.appendChild(btn);
  });
}

function findItemWithdraw(itemId) {
  for (const cat in menuItems) {
    const found = menuItems[cat].find((i) => Number(i.id) === Number(itemId));
    if (found) return found;
  }
  return null;
}

function addToOrderWithdraw(itemId) {
  const stock = findItemWithdraw(itemId);

  if (!stock) {
    showNotificationWithdraw("Error: Item not found.", "alert-danger");
    return;
  }
  if (stock.qty <= 0) {
    showNotificationWithdraw(`${stock.name} is out of stock.`, "alert-danger");
    return;
  }
  const existing = orderListWithdraw.find(
    (i) => Number(i.id) === Number(itemId),
  );
  if (existing) {
    const newQty = existing.qty + 1;
    if (newQty > stock.qty) {
      showNotificationWithdraw(
        `Not enough stock for ${stock.name}. Only ${stock.qty} available.`,
        "alert-danger",
      );
      return;
    }
    existing.qty += 1;
  } else {
    orderListWithdraw.push({
      id: stock.id,
      name: stock.name,
      price: stock.price,
      qty: 1,
      category: stock.category,
      expiry: stock.expiry_date,
      batch: stock.batch_no,
    });
  }
  showNotificationWithdraw(`${stock.name} added to cart!`, "alert-success");
  refreshCartWithdraw();
}

function refreshCartWithdraw() {
  document.getElementById("checkout_btn").textContent = "Checkout Order";
  const cartAreaWithdraw = document.getElementById("order_items_withdraw");
  const totalDisplay = document.getElementById("order_total_withdraw");
  const cashInput = document.getElementById("cash_received");
  let sum = 0;
  if (orderListWithdraw.length === 0) {
    cartAreaWithdraw.innerHTML =
      '<p class="placeholder-text">Cart is empty.</p>';
    totalDisplay.textContent = "₱0.00";
    cashInput.readOnly = true;
    cashInput.value = "";
    return;
  }
  let html = "";
  orderListWithdraw.forEach((item) => {
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
                        <button class="qty-btn" onclick="changeQuantityWithdraw(${
                          item.id
                        }, -1)">−</button>
                        <span class="qty-amount">${item.qty}</span>
                        <button class="qty-btn" onclick="changeQuantityWithdraw(${
                          item.id
                        }, 1)">+</button>
                    </div>
                </div>
                <span class="line-cost">₱${lineTotal.toFixed(2)}</span>
            </div>
        `;
  });
  cartAreaWithdraw.innerHTML = html;
  totalDisplay.textContent = `₱${sum.toFixed(2)}`;
}

function changeQuantityWithdraw(itemId, delta) {
  const orderItem = orderListWithdraw.find(
    (i) => Number(i.id) === Number(itemId), // ensure type-safe comparison
  );

  const stock = findItemWithdraw(itemId);
  if (!stock) return;

  if (orderItem) {
    const updatedQty = orderItem.qty + delta;

    if (updatedQty > 0) {
      if (delta > 0 && updatedQty > stock.qty) {
        // stock.qty from API
        showNotificationWithdraw(
          `Cannot add more ${orderItem.name}. Only ${stock.qty} available.`,
          "alert-danger",
        );
        return;
      }

      orderItem.qty = updatedQty;
    } else {
      // Remove item if qty goes to 0
      orderListWithdraw = orderListWithdraw.filter(
        (i) => Number(i.id) !== Number(itemId),
      );
    }

    refreshCartWithdraw();
    document.getElementById("notification").innerHTML = "";
  }
}

function showNotificationWithdraw(msg, type) {
  const notifBox = document.getElementById("notificationWithdraw");
  notifBox.textContent = msg;
  notifBox.className = `alert ${type}`;
  setTimeout(() => {
    notifBox.textContent = "";
    notifBox.className = "alert";
  }, 4000);
}

function emptyCartWithdraw() {
  if (orderListWithdraw.length === 0) {
    showNotificationWithdraw("Cart is already empty.", "alert-danger");
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
      orderListWithdraw = [];
      refreshCartWithdraw();
    }
  });
}

function processCheckoutWithdraw() {
  if (orderListWithdraw.length === 0) {
    showNotificationWithdraw("Cannot checkout an empty cart.", "alert-danger");
    return;
  }

  const grandTotal = orderListWithdraw.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  // Check stock locally first
  for (const orderItem of orderListWithdraw) {
    const product = findItemWithdraw(orderItem.id);
    if (orderItem.qty > product.stock) {
      showNotificationWithdraw(
        `Checkout failed! Not enough stock for ${orderItem.name}. Available: ${product.stock}`,
        "alert-danger",
      );
      return;
    }
  }

  // Prepare data for backend
  const orderData = {
    items: orderListWithdraw,
    total: grandTotal,
  };

  // Send to PHP
  fetch("actions/process_stock.php", {
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
        const search_box = document.getElementById("stock_search_box");
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = "Checked Out...";
        search_box.value = "";

        // auto-enable after 2 seconds
        setTimeout(() => {
          checkoutBtn.disabled = false;
          checkoutBtn.textContent = "Checkout";
        }, 2000);

        // Update local UI only after successful database save
        for (const orderItem of orderListWithdraw) {
          const product = findItemWithdraw(orderItem.id);
          product.stock -= orderItem.qty;
        }

        // --- IMPORTANT: Instead of manually pushing, we fetch fresh data from DB ---
        fetchSalesHistory().then(() => {
          document.getElementById("cash_change").textContent = "₱0.00";
          document.getElementById("cash_received").value = "";
          showNotificationWithdraw(
            "Order saved to database successfully!",
            "alert-success",
          );
          fetchCosts();

          filterWithdraw("All");
          const allBtn = Array.from(
            document.querySelectorAll(".filter-btn"),
          ).find((btn) => btn.textContent === "All");

          if (allBtn) allBtn.classList.add("active");

          if (loggedInUser.role === "Staff" || loggedInUser.role === "Owner") {
            displayStockReport(orderListWithdraw, grandTotal);
            generateReportNo();
          }

          setupMenuWithdraw().then(() => {
            orderListWithdraw = [];
            refreshCartWithdraw();
            searchWithdraw();
            activeCategoryWithdraw = "All";
          });

          if (loggedInUser.role === "Owner") loadDashboardCost();
        });
      } else {
        showNotificationWithdraw(
          "Database Error: " + data.message,
          "alert-danger",
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotificationWithdraw(
        "Connection error. Please try again.",
        "alert-danger",
      );
    });
}

function filterWithdraw(category, btn) {
  activeCategoryWithdraw = category;
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
  searchWithdraw();
}

function displayStockReport(items, total, payment) {
  const totalQty = orderListWithdraw.reduce((sum, item) => sum + item.qty, 0);
  const timeField = document.getElementById("receipt_time_withdraw");
  const linesArea = document.getElementById("receipt_lines_withdraw");
  const subField = document.getElementById("receipt_sub");
  const totalField = document.getElementById("withdrawal_total_cost");
  const paymentField = document.getElementById("receipt_payment");
  const changeField = document.getElementById("receipt_change");
  const methodField = document.getElementById("receipt_method");
  const total_qty = document.getElementById("total_qty");

  timeField.textContent = new Date().toLocaleString();
  subField.textContent = `₱${total.toFixed(2)}`;
  totalField.textContent = `₱${total.toFixed(2)}`;
  paymentField.textContent = `₱${storedPayment.toFixed(2)}`;
  changeField.textContent = `₱${storedPayment.toFixed(2) - total.toFixed(2)}`;
  methodField.textContent = payment;
  total_qty.textContent = totalQty;

  if (loggedInUser.role === "Owner") {
    name = "Yhaj";
  }
  // Show logged in user
  document.getElementById("cashier_stock").textContent = name;

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
    .map((item) => {
      const expiryInfo = getExpiryColor(item.expiry); // or item.expiry_date
      const remarks =
        expiryInfo.label === "EXPIRED"
          ? "Disposal/Return"
          : expiryInfo.label === "Expires today"
            ? "Use immediately"
            : "Good to use";
      return `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.batch ?? "-"}</td>
         <td> ${new Date(item.expiry).toLocaleDateString("en-PH", {
           year: "numeric",
           month: "long",
           day: "numeric",
         })}</td>
        <td>₱${(item.price * item.qty).toFixed(2)}</td>
        <td>${remarks}</td>
      </tr>
    `;
    })
    .join("");
  document.getElementById("withdraw_report_modal").classList.add("show");
}
function hideReceiptWithdraw() {
  document.getElementById("withdraw_report_modal").classList.remove("show");
}
function doPrintWithdraw() {
  window.print();
}

function generateReportNo() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const reportNo = `RN-${year}${month}${day}-${hours}${minutes}${seconds}`;

  document.getElementById("report_no").textContent = reportNo;

  document.getElementById("sales_report_no").textContent = reportNo;

  return reportNo;
}
