 <div id="show-cost" style="display: none;">
                         <div class="stats-wrapper">
                        <div class="stat-box"  style="cursor: pointer;">
                            <h3>Today's Cost</h3>
                            <div class="stat-number" id="today_costs">₱0.00</div>
                            <div class="stat-desc">Total Cost</div>
                        </div>
                        <div class="stat-box">
                            <h3>Withdrawals</h3>
                            <div class="stat-number" id="total_orders_costs">0</div>
                            <div class="stat-desc">Withdrawals Completed</div>
                        </div>
                        <div class="stat-box">
                            <h3>Average Cost</h3>
                            <div class="stat-number" id="avg_order_costs">₱0.00</div>
                            <div class="stat-desc">Per Withdrawal</div>
                        </div>
                        <div class="stat-box">
                            <h3>Critical Items</h3>
                            <div class="stat-number" id="low_stock_count_costs">0</div>
                            <div class="stat-desc">Low Stocks</div>
                        </div>
                    </div>

                    <div class="recent-sales-section">
                        <h2 style="margin-bottom: 1rem; color: #000000;">Recent Withdrawals</h2>
                        <div id="recent_transactions_costs"></div>
                    </div>

                    <!-- CHART CARD -->
                            <div class="chart-card">
                            <div class="chart-header">
                                <h2 style="margin-bottom: 1rem;margin-left: 1rem;color: #000000;">Cost Overview</h2>

                                <select id="costsFilter" onchange="updateCostsChart()" >
                                <option value="day" selected>Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annually</option>
                                </select>
                            </div>

                            <canvas id="costsChart"></canvas>
                            </div>
                     </div>
                   