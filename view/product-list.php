<!-- INVENTORY MANAGEMENT -->
                <div id="inventory-screen" class="screen-view" style="display: none;">
                    <div class="section-header">
                        <div>
                            <h2 style="color: #000000;">Product List</h2>
                            <p style="color: #666666;">Manage Ready-to-Serve and Pre-Cooked Meals(Pantry)</p>
                        </div>
                         <button class="add-btn" onclick="showAddModal()" > + Add New Item </button>
                        <button class="add-btn" onclick="showAddModalArchived()">Archived</button>
                    </div>
                    <div id="product" style="display: block;">
                        <div style="width:100%; display:flex; align-items:center; gap:12px;" class="input-group">

                                        <input
                                            type="text"
                                            id="search_inventory_name"
                                            placeholder="Search Product Name..."
                                            oninput="handleSearch(this)"
                                            style="flex:1;"
                                        >

                                        <select
                                            id="category_filter"
                                            onchange="applyCategoryFilter()"
                                            style="flex:1;"
                                        >
                                            <option selected hidden>Select Category</option>
                                        </select>

                                        
                        </div>
                                   
                <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price (₱)</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="inventory_list"></tbody>
                    </table>
                </div>
            </div>
        </div>

                 
                