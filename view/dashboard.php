 <!-- DASHBOARD -->


              
                     <div id="show-dashboard"  style="display: block;">
                         <div class="stats-wrapper">
                        <div class="stat-box" onclick="switchScreen('sales');show_daily_Sales()"  style="cursor: pointer;"> 
                            <h3>Today's Sales</h3>
                            <div class="stat-number" id="today_sales">₱0.00</div>
                            <div class="stat-desc">Total Revenue</div>
                        </div>
                        <div class="stat-box">
                            <h3>Transactions</h3>
                            <div class="stat-number" id="total_orders">0</div>
                            <div class="stat-desc">Orders Completed</div>
                        </div>
                        <div class="stat-box">
                            <h3>Average Order</h3>
                            <div class="stat-number" id="avg_order">₱0.00</div>
                            <div class="stat-desc">Per Transaction</div>
                        </div>
                        <div class="stat-box">
                            <h3>No/Low Availability</h3>
                            <div class="stat-number" id="low_stock_count">0</div>
                            <div class="stat-desc">Need to Buffer</div>
                        </div>
                    </div>

                    <div class="recent-sales-section">
                        <h2 style="margin-bottom: 1rem; color: #000000;">Recent Transactions</h2>
                        <div id="recent_transactions"></div>
                    </div>

                    <!-- CHART CARD -->
                            <div class="chart-card">
                            <div class="chart-header">
                                <h2 style="margin-bottom: 1rem;margin-left: 1rem;color: #000000;">Sales Overview</h2>

                                <select id="salesFilter" onchange="updateSalesChart()" >
                                <option value="day" selected>Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annually</option>
                                </select>
                            </div>

                            <canvas id="salesChart"></canvas>
                            </div>
                     </div>
                   
      
