function loadArchivedItemsMain() {
  const table = document.getElementById("archived_list_main");
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
        <button class="delete-btn" onclick="restoreItemMain(${item.id})">
          Restore
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

function showAddModalArchivedMain() {
  document.getElementById("popup_titles").textContent = "Archived Items";
  document.getElementById("archived_modal_main").classList.add("show");

  fetch("actions/get_deleted_main.php")
    .then((response) => response.json())
    .then((data) => {
      archivedItems = data;

      populateArchivedCategoryFilterMain(data);

      // default = All
      archivedSelectedCategory = "";
      document.getElementById("archived_category_filter_main").value = "";

      loadArchivedItemsMain();
    })
    .catch((error) => {
      console.error("Error fetching deleted items:", error);
    });
}

function hideModalArchivedMain() {
  document.getElementById("archived_modal_main").classList.remove("show");
}

//archived filter by Category
function applyArchivedCategoryFilterMain() {
  archivedSelectedCategory = document.getElementById(
    "archived_category_filter_main",
  ).value;

  loadArchivedItemsMain();
}

function populateArchivedCategoryFilterMain(data) {
  const select = document.getElementById("archived_category_filter_main");
  select.innerHTML = `<option value="">All Categories</option>`;

  const categories = [...new Set(data.map((item) => item.category))];

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function searchArchivedByNameMain(searchText) {
  const table = document.getElementById("archived_list_main");
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

function restoreItemMain(itemId) {
  document.getElementById("archived_modal_main").classList.remove("show");
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
          inventoryMain();
          loadArchivedItemsMain();
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
