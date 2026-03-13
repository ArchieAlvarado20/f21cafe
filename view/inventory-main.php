  <!-- INVENTORY MAIN MANAGEMENT -->
                <div id="inventory-main-screen" class="screen-view" style="display: none;">
                    <div class="section-header">
                        <div>
                            <h2 style="color: #000000;">Inventory Items</h2>
                            <p style="color: #666666;">Manage Raw Ingridients and Stocks</p>
                        </div>
                       <button class="add-btn" onclick="showAddModalMain()"> + Add New Items </button>
                        <button class="add-btn" onclick="showAddModalArchivedMain(),showInventoryMain()">Archived</button>
    
                    </div>
                    <div id="inventory-main" style="display: block;">
                            <div style="width:100%; display:flex; align-items:center; gap:12px;" class="input-group">

                                        <input
                                            type="text"
                                            id="inventory_search_box_main"
                                            placeholder="Search inventory name..."
                                            oninput="handleSearch(this)"
                                            style="flex:1;"
                                        >

                                        <select
                                            id="category_filter_main"
                                            style="flex:1;"
                                        >
                                        <option value="">All Categories</option>
                                        </select>       
                        </div>
                                    <div class="table-wrapper">
                                            <table class="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Category</th>
                                                        <th>Current Price (₱)</th>
                                                        <th>Total Stocks</th>
                                                        <th>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="inventory_main"></tbody>
                                            </table>
                                        </div>
                    </div>    
                </div>

                