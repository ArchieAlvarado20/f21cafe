function loadCategoryMain() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  const table = document.getElementById("category_list");
  const filterValue = document.getElementById("mainFilter").value;

  table.innerHTML = "";

  fetch("actions/category.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      allInventoryCategoryItems = data;
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

      let allCategory = allInventoryCategoryItems;

      // ✅ FILTER PART
      if (filterValue !== "all") {
        allCategory = allCategory.filter((item) => item.main == filterValue);
      }

      // Sort newest first
      if (allCategory && allCategory.length > 0) {
        allCategory = [...allCategory].sort((a, b) => b.id - a.id);
      }

      if (!allCategory || allCategory.length === 0) {
        table.innerHTML = `
          <tr>
            <td colspan="5" style="text-align:center; padding:20px; color:#888;">
              No inventory data available
            </td>
          </tr>
        `;
        return;
      }

      allCategory.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${item.name}</td>
          <td>${item.main == 1 ? "Stocks" : "Products"}</td>
          <td>${item.created_at}</td>
       
        `;
        // <td>
        //   <button class="edit-btn" onclick="showEditModal_InventoryCategory(${item.id})">Edit</button>
        //   <button class="delete-btn" onclick="removeItemCategory(${item.id})">Delete</button>
        // </td>
        table.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error loading inventory:", error);
    });
}

function findItemCategory(itemId) {
  return (
    allInventoryCategoryItems.find(
      (item) => Number(item.id) === Number(itemId),
    ) || null
  );
}

function showAddModal_InventoryCategory() {
  document.getElementById("popup_title_inventory_category").textContent =
    "Add Inventory Category";
  document.getElementById("item_form_inventory_category").reset();
  document.getElementById("inventory_category_modal").classList.add("show");
}

function hideModal_InventoryCategory() {
  document.getElementById("inventory_category_modal").classList.remove("show");
}

function showEditModal_InventoryCategory(itemId) {
  const item = findItemCategory(itemId);
  if (!item) return;
  document.getElementById("popup_title_inventory_category").textContent =
    "Edit Inventory Category";
  document.getElementById("editing_id_inventory_category").value = item.id;
  document.getElementById("item_name_inventory_category").value = item.name;
  document.getElementById("category_main").value = item.main;
  document.getElementById("inventory_category_modal").classList.add("show");
}

function submitItem_InventoryCategory(e) {
  e.preventDefault();

  const editingId = document.getElementById(
    "editing_id_inventory_category",
  ).value;
  let itemName = document
    .getElementById("item_name_inventory_category")
    .value.trim()
    .toLowerCase();

  itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  const itemMain = document.getElementById("category_main").value.trim();

  const formData = new FormData();
  formData.append("name", capitalizeWords(itemName));
  formData.append("main", itemMain);

  let url = "actions/add_item_inventory_category.php";
  if (editingId) {
    formData.append("id", editingId);
    url = "actions/update_item_inventory_category.php";
  }
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire({
          text: "Category Successfully Added!",
          icon: "success",
          confirmButtonColor: "#070000ff",
          timer: 2500,
        });
        hideModal_InventoryCategory();
        loadCategoryMain();
      } else {
        showNotification("Error: " + data.message, "alert-danger");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showNotification("An error occurred. Please try again.", "alert-danger");
    });
}

function removeItemCategory(itemId) {
  Swal.fire({
    title: "Deleting...",
    text: "Are you sure you want to delete this category?",
    theme: "light",
    showCancelButton: true,
    confirmButtonColor: "#070000ff",
    cancelButtonColor: "rgba(8, 0, 0, 1)",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      // Generate current datetime for deleted_at
      const deletedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

      const formData = new FormData();
      formData.append("id", itemId);
      formData.append("status", "deleted"); // 👈 important!
      formData.append("deleted_at", deletedAt); // 👈 important!

      fetch("actions/delete_category.php", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            loadCategoryMain();
            Swal.fire({
              text: "Successfully Deleted!",
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
