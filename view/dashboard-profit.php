    
    <div id="show-dashboard-profit" style="display: none;">
                         <div class="stats-wrapper">
                        <div class="stat-box" onclick=""  style="cursor: pointer;"> 
                            <h3>Today's Profit</h3>
                            <div class="stat-number" id="todayProfit">₱0.00</div>
                            <div class="stat-desc">Total Profit</div>
                        </div>
                       
                    </div> 
                    <!-- CHART CARD -->
                            <div class="chart-card">
                            <div class="chart-header">
                                <h2 style="margin-bottom: 1rem;margin-left: 1rem;color: #000000;">Profit Preview</h2>

                                <select id="profitFilter" onchange="updateProfitChart()" >
                                <option value="day" selected>Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="year">This Year</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="annual">Annually</option>
                                </select>
                            </div>

                            <canvas id="profitChart"></canvas>
                            </div>
                     </div>
                   
      
