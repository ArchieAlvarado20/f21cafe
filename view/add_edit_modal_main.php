 <div id="stock_modal" class="popup">
        <div class="popup-box">
            <div class="popup-header">
                <h2 id="popup_title_main">Add New Stocks</h2>
                <span class="close-btn" onclick="hideModalMain()">&times;</span>
            </div>
            <form id="item_form_main" onsubmit="submitItemMain(event)">
                <input type="hidden" id="editing_id_main">
                <div class="input-group">
                    <label for="item_name">Item Name</label>
                    <input type="text" id="item_name_main" required>
                </div>
                <div class="input-group">
                    <label for="item_cat">Category</label>
                    <select id="item_cat_main" required>
                        <option value="">Select Category</option>
                    </select>
                </div>
                <div class="popup-buttons">
                    <button type="button" class="cancel-btn" onclick="hideModalMain()">Cancel</button>
                    <button type="submit" class="save-btn">Save Item</button>
                </div>
            </form>
        </div>
    </div>