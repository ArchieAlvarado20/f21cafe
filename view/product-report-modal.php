  <!-- ====================== PRODUCT REPORT MODAL ====================== -->
    <div id="product_report_modal" class="popup">
        <div class="popup-box-archived">
            <div class="popup-header">
                <h2 id="popup_titles"></h2>
                <span class="close-btn" onclick="hideModalProductReport()">&times;</span>
            </div>
                
                   <div class="table-wrapper">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Price</th>
                                <th>Sales</th>
                                <th>Sold</th>
                                <th>Range Date</th>
                            </tr>
                        </thead>
                        <tbody id="product-reports"></tbody>
                    </table>
                         <!-- CHART CARD -->
                            <div class="chart-card">
                            <div class="chart-header">
                                <h2 style="margin-bottom: 1rem;margin-left: 1rem;color: #000000;">Product Sales Overview</h2>
                            </div>

                          <canvas id="productLineChart" height="80"></canvas>
                            </div>
                </div>
            </div>
             
        </div>