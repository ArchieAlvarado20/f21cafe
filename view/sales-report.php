        <div id="productDiv" style="display: none;">
                             <div style="display: flex;">
                                <h2 style="margin-bottom: 1rem;margin-right:1rem">Product Reports: </h2>
                            </div>
                            <div class="input-group" style="width: 100%;display:flex">
                                <input
                                    type="text"
                                    id="search_product_name"
                                    placeholder="Search Product name..."
                                    oninput="handleSearch(this)"
                                    >

                                     <select id="product_filter" onchange="applyProductFilter()">
                                             <option value="">All Categories</option>
                                    </select>
                                </div>
                                <div class="table-wrapper">
                                    <table class="data-table">
                                        <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Category</th>
                                                <th>Price (₱)</th>
                                                <th>Reports</th>
                                            </tr>
                                        </thead>
                                        <tbody id="product_report"></tbody>
                                    </table> 
                                </div>
                            
                    </div>