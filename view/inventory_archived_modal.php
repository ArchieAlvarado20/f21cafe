 <div id="archived_modal_main" class="popup">
        <div class="popup-box-archived">
            <div class="popup-header">
                <h2 id="popup_titles">Archived Stocks</h2>
                <span class="close-btn" onclick="hideModalArchivedMain()">&times;</span>
            </div>
                <div class="input-group" style="width: 100%;display:flex" >
                       <input
                                        type="text"
                                        id="archived_search_box_main"
                                        placeholder="Search archived item by name..."
                                        oninput="handleSearch(this)"
                                        >
                           <select id="archived_category_filter_main" onchange="applyArchivedCategoryFilterMain()">
                                <option value="">All Categories</option>
                            </select>
                        </div>
            <div class="table-wrapper-archived">
                  <table class="data-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price (₱)</th>
                                <th>Deleted at</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="archived_list_main"></tbody>
                    </table>
            </div>
             
        </div>
    </div>
