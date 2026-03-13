 <div id="item_modal" class="popup">
        <div class="popup-box">
            <div class="popup-header">
                <h2 id="popup_title">Add New Item</h2>
                <span class="close-btn" onclick="hideModal()">&times;</span>
            </div>
            <form id="item_form" onsubmit="submitItem(event)">
                <input type="hidden" id="editing_id">
                <div class="input-group">
                    <label for="item_name">Item Name</label>
                    <input type="text" id="item_name" required>
                </div>
                <div class="input-group">
                    <label for="item_cat">Category</label>
                    <select id="item_cat" required>
                        <option value="">Select Category</option>
                        <!-- <option value="Salad">Salad</option>
                        <option value="Snacks">Snacks</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Sandwich">Sandwich</option>
                        <option value="Cake">Cake</option>
                        <option value="Coffee">Coffee</option>
                        <option value="Frappuccino">Frappuccino</option>
                        <option value="Frappe">Frappe</option>
                        <option value="Non-Coffee">Non-Coffee</option>
                        <option value="Tea">Tea</option>
                        <option value="Silog Meals">Silog Meals</option> -->
                    </select>
                </div>
                <div class="input-group">
                    <label for="item_price">Price (₱)</label>
                    <input type="number" id="item_price" min="0" step="0.01" required>
                </div>
                <div class="input-group">
                    <label for="item_qty">Product Availability</label>
                    <input type="number" id="item_qty" min="0" required>
                </div>
                <div class="popup-buttons">
                    <button type="button" class="cancel-btn" onclick="hideModal()">Cancel</button>
                    <button type="submit" class="save-btn">Save Item</button>
                </div>
            </form>
        </div>
    </div>