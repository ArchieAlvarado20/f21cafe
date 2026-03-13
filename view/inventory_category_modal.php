 <div id="inventory_category_modal" class="popup">
        <div class="popup-box">
            <div class="popup-header">
                <h2 id="popup_title_inventory_category">Add New Category</h2>
                <span class="close-btn" onclick="hideModal_InventoryCategory()">&times;</span>
            </div>
            <form id="item_form_inventory_category" onsubmit="submitItem_InventoryCategory(event)">
                <input type="hidden" id="editing_id_inventory_category">
                <div class="input-group">
                    <label for="item_name">Category Name</label>
                    <input type="text" id="item_name_inventory_category" placeholder="Enter Category Name..." required>

                    <select
                                            id="category_main"
                                            onchange="applyCategoryFilter()"
                                            style="flex:1;margin-top:1rem"
                                        >
                                            <option value="0">Products</option>
                                            <option value="1">Stocks</option>
                                        </select>
                </div>
                <div class="popup-buttons">
                    <button type="button" class="cancel-btn" onclick="hideModal_InventoryCategory()">Cancel</button>
                    <button type="submit" class="save-btn">Save Category</button>
                </div>
            </form>
        </div>
    </div>