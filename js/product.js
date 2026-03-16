function loadInventory({
  tableId = "inventory_list",
  main = null, // null = lahat, 0 = normal, 1 = main
} = {}) {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  const table = document.getElementById(tableId);
  table.innerHTML = "";

  let items = [...allInventoryItems];

  //dashboard availability
  const noItemCount = allInventoryItems.filter(
    (item) => item.stock <= 5 && item.stock >= 0,
  ).length;

  document.getElementById("low_stock_count").textContent = noItemCount;

  document.getElementById("DC_availability").textContent = noItemCount;

  // sort
  items.sort((a, b) => b.id - a.id);

  // filter by main
  if (main !== null) {
    items = items.filter((item) => Number(item.main) === Number(main));
  }

  // filter by category
  if (selectedCategory !== "") {
    items = items.filter((item) => item.category === selectedCategory);
  }

  // filter by name
  if (inventorySearchText !== "") {
    items = items.filter((item) =>
      item.name.toLowerCase().includes(inventorySearchText.toLowerCase()),
    );
  }

  if (items.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:20px; color:#888;">
          No inventory data available
        </td>
      </tr>
    `;
    return;
  }

  items.forEach((item) => {
    const lowStock = item.stock <= 5 && item.stock >= 0;
    const noStock = item.stock <= 0;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>₱${item.price.toFixed(2)}</td>
      <td class="${lowStock || noStock ? "stock-warning" : ""}">
        ${item.stock} ${lowStock ? "⚠️" : ""} ${noStock ? "❌" : ""}
      </td>
      <td>
        <button class="edit-btn" onclick="openEditModal(${item.id})">Edit</button>
        <button class="delete-btn" onclick="removeItem(${item.id})">Archived</button>
      </td>
    `;
    table.appendChild(row);
  });
}

// Setup menu by fetching from Database
function setupMenu() {
  return fetch("actions/get_inventory.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      allInventoryItems = data;
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

      populateInventoryCategoryFilter(allInventoryItems);
      populateProductReportCategoryFilter(allInventoryItems);

      return true;
    })

    .catch((error) => {
      console.error("Error loading inventory:", error);
      const productArea = document.getElementById("products_list");
      if (productArea) {
        productArea.innerHTML =
          '<p class="placeholder-text" style="color:red;">Error loading menu from database.</p>';
      }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu().then(() => {
    const select = document.getElementById("category_filter");

    // Force dropdown to select “all”
    select.value = "";

    // Trigger your category change logic
    select.dispatchEvent(new Event("change"));
  });
});

// filter invetory by category
function applyCategoryFilter() {
  selectedCategory = document.getElementById("category_filter").value;
  loadInventory();
}

// filter inventory by name
let inventorySearchText = "";

function searchInventoryByName(text) {
  inventorySearchText = text;
  loadInventory();
}

function populateItemCategory() {
  const select = document.getElementById("item_cat");

  select.innerHTML = `<option value="" hidden>Select Category</option>`;

  return fetch("actions/selectCategory.php?main=0")
    .then((res) => res.json())
    .then((data) => {
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

function showAddModal() {
  document.getElementById("popup_title").textContent = "Add New Item";
  document.getElementById("item_form").reset();
  document.getElementById("editing_id").value = "";
  document.getElementById("item_modal").classList.add("show");

  populateItemCategory();
}
function hideModal() {
  document.getElementById("item_modal").classList.remove("show");
}

async function openEditModal(itemId) {
  const item = findItem(itemId);
  if (!item) return;

  document.getElementById("popup_title").textContent = "Edit Item";
  document.getElementById("editing_id").value = item.id;

  // wait for categories
  await populateItemCategory();

  const select = document.getElementById("item_cat");
  select.value = item.category;

  document.getElementById("item_name").value = item.name;
  document.getElementById("item_price").value = item.price;
  document.getElementById("item_qty").value = item.stock;

  document.getElementById("item_modal").classList.add("show");
}

function submitItem(e) {
  e.preventDefault();

  const editingId = document.getElementById("editing_id").value;
  const itemName = document.getElementById("item_name").value.trim();
  const category = document.getElementById("item_cat").value;
  const price = document.getElementById("item_price").value;
  const quantity = document.getElementById("item_qty").value;

  const formData = new FormData();
  formData.append("name", itemName);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("stock", quantity);

  let url = "actions/add_item.php";
  if (editingId) {
    formData.append("id", editingId);
    url = "actions/update_item.php";
  }

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          text: "Item Successfully Added!",
          icon: "success",
          confirmButtonColor: "#070000ff",
          timer: 2500,
        });
        hideModal();
        setupMenu().then(() => {
          loadInventory();
        });
      } else {
        showNotification("Error: " + data.message, "alert-danger");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification("An error occurred. Please try again.", "alert-danger");
    });
}

function removeItem(itemId) {
  Swal.fire({
    title: "Archiving...",
    text: "Are you sure you want to archive this item?",
    theme: "light",
    showCancelButton: true,
    confirmButtonColor: "#070000ff",
    cancelButtonColor: "rgba(8, 0, 0, 1)",
    confirmButtonText: "Yes, archive it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Generate current datetime for deleted_at
      const deletedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

      const formData = new FormData();
      formData.append("id", itemId);
      formData.append("status", "deleted"); // 👈 important!
      formData.append("deleted_at", deletedAt); // 👈 important!

      fetch("actions/delete_item.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            showNotification(data.message, "alert-success");
            setupMenu().then(() => {
              loadInventory();
            });

            Swal.fire({
              text: "Successfully Archived!",
              icon: "success",
              confirmButtonColor: "#070000ff",
              timer: 2500,
            });
          } else {
            showNotification("Error: " + data.message, "alert-danger");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          showNotification("Failed to delete item.", "alert-danger");
        });
    }
  });
}

function populateInventoryCategoryFilter(data) {
  const select = document.getElementById("category_filter");

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
