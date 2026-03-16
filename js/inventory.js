function inventoryMain() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  fetch("actions/get_inventory-main.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      allInventoryItemsMain = data || [];

      const table = document.getElementById("inventory_main");
      table.innerHTML = "";

      const noStockCount = allInventoryItemsMain.filter(
        (item) => item.total_qty <= 5 && item.total_qty >= 0,
      ).length;

      document.getElementById("low_stock_count_costs").textContent =
        noStockCount;

      document.getElementById("DC_critical").textContent = noStockCount;

      if (allInventoryItemsMain.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:20px; color:#888;">
              No inventory data available
            </td>
          </tr>
        `;
        return;
      }

      // Sort newest first
      const sortedItems = [...allInventoryItemsMain].sort(
        (a, b) => b.id - a.id,
      );

      // Filter by category if selected
      let filteredItems = [...sortedItems];
      if (inventorySelectedCategory) {
        filteredItems = filteredItems.filter(
          (item) => item.category === inventorySelectedCategory,
        );
      }

      // Render table
      filteredItems.forEach((item) => {
        const lowStock = item.total_qty <= 5;
        const noStock = item.total_qty <= 0;

        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.category}</td>
          <td>₱${parseFloat(item.current_price).toFixed(2)}</td>
          <td class="${lowStock || noStock ? "stock-warning" : ""}" style="font-weight:700;">
            ${noStock ? "Out of Stock ❌" : `${item.total_qty} ${lowStock ? "⚠️" : ""}`}
          </td>
          <td>
            <button class="edit-btn" onclick="openEditModalMain(${item.id})">Edit</button>
            <button class="edit-btn" onclick="openAddStockModal(${item.id})">+ Add Stocks</button>
            <button class="delete-btn" onclick="removeItemMain(${item.id})">Archived</button>
          </td>
        `;
        table.appendChild(row);
      });

      // Populate category select dynamically
      populateInventoryCategoryFilterMain(allInventoryItemsMain);
    })
    .catch((error) => {
      console.error("Error loading inventory:", error);
      const table = document.getElementById("inventory_main");
      table.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:20px; color:red;">
            Error loading inventory from database.
          </td>
        </tr>
      `;
    });
}

// Show add modal
function showAddModalMain() {
  document.getElementById("popup_title_main").textContent = "Add New Stocks";
  document.getElementById("item_form_main").reset();
  document.getElementById("editing_id_main").value = "";
  document.getElementById("stock_modal").classList.add("show");

  populateItemCategoryMain();
}

// Hide modal
function hideModalMain() {
  document.getElementById("stock_modal").classList.remove("show");
}

// Hide modal
function hideModalStock() {
  document.getElementById("add_stock_modal").classList.remove("show");
}

// Find item by ID
function findItemMain(itemId) {
  return (
    allInventoryItemsMain.find((item) => Number(item.id) === Number(itemId)) ||
    null
  );
}

// Open edit modal
async function openEditModalMain(itemId) {
  const item = findItemMain(itemId);
  if (!item) return;

  document.getElementById("popup_title_main").textContent = "Edit Stocks";
  document.getElementById("editing_id_main").value = item.id;

  // populate categories first
  await populateItemCategoryMain();

  const select = document.getElementById("item_cat_main");
  select.value = item.category;

  document.getElementById("item_name_main").value = item.name;
  // document.getElementById("item_price_main").value = item.price;
  // document.getElementById("item_qty_main").value = item.stock;

  document.getElementById("stock_modal").classList.add("show");
}

function openAddStockModal(itemId) {
  const itemStock = findItemMain(itemId);
  if (!itemStock) return;
  document.getElementById("popup_title_stock").textContent = `Add Stocks`;
  document.getElementById("item_form_stock").reset();
  document.getElementById("item_name_stock").value = itemStock.name;
  document.getElementById("editing_id_stock").value = itemStock.id;

  // Generate batch number
  const initials = itemStock.name
    .split(" ")
    .map((word) => {
      const firstChar = word.match(/[a-zA-Z0-9]/)?.[0];
      return firstChar || "";
    })
    .join("")
    .toUpperCase();

  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6 digits
  const batchNo = `${initials}-${randomDigits}`;

  // Set batch number field
  document.getElementById("batch").value = batchNo;

  document.getElementById("add_stock_modal").classList.add("show");
}

// Submit add/edit
function submitItemMain(e) {
  e.preventDefault();

  const editingId = document.getElementById("editing_id_main").value;
  const itemName = document.getElementById("item_name_main").value.trim();
  const category = document.getElementById("item_cat_main").value;
  // const quantity = document.getElementById("item_qty_main").value;

  const formData = new FormData();
  formData.append("name", capitalizeWords(itemName));
  formData.append("category", category);
  // formData.append("price", price);
  // formData.append("stock", quantity);

  let url = "actions/add_item_main.php";
  if (editingId) {
    formData.append("id", editingId);
    url = "actions/update_item_main.php";
  }

  fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          text: editingId ? "Stock Updated!" : "Stock Added!",
          icon: "success",
          confirmButtonColor: "#070000ff",
          timer: 2000,
        });
        hideModalMain();
        inventoryMain();
      } else {
        showNotification("Error: " + data.message, "alert-danger");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      showNotification("An error occurred. Please try again.", "alert-danger");
    });
}

// Submit add Stock
function submitItemStock(e) {
  e.preventDefault();

  const editingId = document.getElementById("editing_id_stock").value;
  const batch = document.getElementById("batch").value;
  const price = parseFloat(document.getElementById("item_price_stock").value);
  const description = document.getElementById("description").value;
  const quantity = parseInt(
    document.getElementById("item_qty_stock").value,
    10,
  );
  const expiry = document.getElementById("expiry").value;

  if (!batch || !price || !quantity || !expiry) {
    showNotification("Please fill all fields.", "alert-danger");
    return;
  }

  const formData = new FormData();
  formData.append("stock_id", editingId);
  formData.append("batch_no", batch); // match sa PHP
  formData.append("price", price);
  formData.append("description", description);
  formData.append("qty", quantity);
  formData.append("expiry_date", expiry);

  const url = "actions/add_stock.php";

  fetch(url, { method: "POST", body: formData })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          text: "Stock Added!",
          icon: "success",
          confirmButtonColor: "#070000ff",
          timer: 2000,
        });
        hideModalStock();
        inventoryMain();
      } else {
        showNotification("Error: " + data.message, "alert-danger");
      }
    })
    .catch((err) => {
      console.error("Error:", err);
      showNotification("An error occurred. Please try again.", "alert-danger");
    });
}

// Remove (archive) item
function removeItemMain(itemId) {
  Swal.fire({
    title: "Archiving...",
    text: "Are you sure you want to archive this item?",
    showCancelButton: true,
    confirmButtonColor: "#070000ff",
    cancelButtonColor: "#888",
    confirmButtonText: "Yes, archive it!",
  }).then((result) => {
    if (!result.isConfirmed) return;

    const deletedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const formData = new FormData();
    formData.append("id", itemId);
    formData.append("status", "deleted");
    formData.append("deleted_at", deletedAt);

    fetch("actions/delete_item.php", { method: "POST", body: formData })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          showNotification(data.message, "alert-success");
          inventoryMain();
          Swal.fire({
            text: "Successfully Archived!",
            icon: "success",
            confirmButtonColor: "#070000ff",
            timer: 2000,
          });
        } else {
          showNotification("Error: " + data.message, "alert-danger");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        showNotification("Failed to archive item.", "alert-danger");
      });
  });
}

// Category filter
document
  .getElementById("category_filter_main")
  .addEventListener("change", function () {
    inventorySelectedCategory = this.value;
    inventoryMain(); // re-render table with filter
  });

function populateInventoryCategoryFilterMain(data) {
  const select = document.getElementById("category_filter_main");

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

function searchInventoryByNameMain(searchText) {
  const table = document.getElementById("inventory_main");
  table.innerHTML = "";

  // Use the correct array
  let filtered = allInventoryItemsMain.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Apply category filter if any
  if (inventorySelectedCategory !== "") {
    filtered = filtered.filter(
      (item) => item.category === inventorySelectedCategory,
    );
  }

  // No items found
  if (filtered.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:#888;">
          No items found
        </td>
      </tr>
    `;
    return;
  }

  // Render filtered items
  filtered.forEach((item) => {
    const lowStock = item.total_qty <= 5 && item.total_qty >= 0;
    const noStock = item.total_qty <= 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
          <td>${item.category}</td>
          <td>₱${parseFloat(item.current_price).toFixed(2)}</td>
          <td class="${lowStock || noStock ? "stock-warning" : ""}" style="font-weight:700;">
            ${noStock ? "Out of Stock ❌" : `${item.total_qty} ${lowStock ? "⚠️" : ""}`}
          </td>
          <td>
            <button class="edit-btn" onclick="openEditModalMain(${item.id}), populateItemCategoryMain();">Edit</button>
            <button class="edit-btn" onclick="openAddStockModal(${item.id})">+ Add Stocks</button>
            <button class="delete-btn" onclick="removeItemMain(${item.id})">Archived</button>
          </td>
    `;
    table.appendChild(row);
  });
}

function populateItemCategoryMain() {
  const select = document.getElementById("item_cat_main");

  // Reset first
  select.innerHTML = `<option value="" hidden>Select Category</option>`;

  // Fetch categories from backend
  return fetch("actions/selectCategory.php?main=1") // adjust endpoint if needed
    .then((res) => res.json())
    .then((data) => {
      if (!data || data.length === 0) return;

      // Avoid duplicates in case the backend has repeated categories
      const uniqueCategories = [
        ...new Set(data.map((item) => item.name)),
      ].sort();

      uniqueCategories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      });
    });
}

const expiryInput = document.getElementById("expiry");

// Get today in **local time**
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-indexed
const day = String(today.getDate()).padStart(2, "0");

const localDate = `${year}-${month}-${day}`;
expiryInput.setAttribute("min", localDate);

// Optional: auto open calendar on focus
expiryInput.addEventListener("focus", () => {
  expiryInput.showPicker?.();
});
