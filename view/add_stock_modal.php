 <div id="add_stock_modal" class="popup">
        <div class="popup-box">
            <div class="popup-header">
                <h2 id="popup_title_stock">Add Stock to Item</h2>
                <span class="close-btn" onclick="hideModalStock()">&times;</span>
            </div>
            <form id="item_form_stock" onsubmit="submitItemStock(event)">
                <input type="hidden" id="editing_id_stock">
                <div class="input-group">
                    <label for="item_name">Item Name</label>
                    <input type="text" id="item_name_stock" readonly style="background-color:#F5F5F5">
                </div>
                <div class="input-group">
                    <label for="item_name">Batch no.</label>
                    <input type="text" id="batch" readonly style="background-color:#F5F5F5">
                </div>
                 <div class="input-group">
                    <label for="item_name">Description</label>
                    <input type="text" id="description" required>
                </div>
                <div class="input-group">
                    <label for="item_price">Price (₱)</label>
                    <input type="number" id="item_price_stock" min="0" step="0.01" required>
                </div>
                <div class="input-group">
                    <label for="item_qty">Stocks Qty</label>
                    <input type="number" id="item_qty_stock" min="0" required>
                </div>
                 <div class="input-group">
                    <label for="item_qty">Expiry Date</label>
                    <input type="date" id="expiry" min="0" required>
                </div>
                <div class="popup-buttons">
                    <button type="button" class="cancel-btn" onclick="hideModalStock()">Cancel</button>
                    <button type="submit" class="save-btn">Add Stocks</button>
                </div>
            </form>
        </div>
    </div>