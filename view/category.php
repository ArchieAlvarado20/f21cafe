           <div id="category-main-screen" class="screen-view" style="display: none;">
                    <div class="section-header">
                        <div>
                            <h2 style="color: #000000;">Categories</h2>
                            <p style="color: #666666;">Manage Categories for Products and Stocks</p>
                        </div>
                      <button class="add-btn" onclick="showAddModal_InventoryCategory()">+ Add New Category</button>
                        <!-- <button class="add-btn" onclick="showAddModalArchivedMain(),showInventoryMain()">Archived</button> -->
                    </div>
                     <div style="width: 25%; display:flex; align-items:center; gap:12px;" class="input-group">
                            <select id="mainFilter" onchange="loadCategoryMain()">
                                <option value="all">All</option>
                                <option value="0">Products</option>
                                <option value="1">Stocks</option>  
                            </select>
                     </div>

                <div id="category-main" style="display: block;">
                         <div class="table-wrapper">
                                            <table class="data-table">
                                                <thead>
                                                    <tr>
                                                        <th>Category Name</th>
                                                        <th>Class</th>
                                                        <th>Created at</th>
                                                        <!-- <th>Actions</th> -->
                                                    </tr>   
                                                </thead>
                                                <tbody id="category_list"></tbody>
                                            </table>
                                        </div>
                    </div>
           </div>

    