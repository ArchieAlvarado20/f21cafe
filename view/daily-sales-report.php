<div id="sales_report_modal" class="receipt-popup">
  <div class="receipt-box-sales-report">
    <div class="receipt-print-sales-report" id="withdrawal_area">

      <!-- ===== REPORT HEADER ===== -->
      <div class="receipt-top">
        <h2>F21 CAFE</h2>
        <strong>Daily Sales & Cost Report</strong>
        <p>123 Sample Street, Brgy. Demo, Quezon City</p>

        <p><strong>Date:</strong> <span id="receipt_time_report"></span></p>
        <p><strong>Report No:</strong> <span id="sales_report_no"></span></p>
        <p><strong>Handled By:</strong> <span id="cashier_report"></span></p>
      </div>

     <!-- ===== SUMMARY CARDS ===== -->
        <div class="summary-cards">

          <!-- SALES CARD -->
          <div class="summary-card sales-card">
            <h3>Daily Sales</h3>
            <p><strong>Total Sales:</strong> ₱<span id="TS_report">0.00</span></p>
            <p><strong>Orders:</strong> <span id="TO_report">0</span></p>
            <p><strong>Average Order:</strong> ₱<span id="AV_report">0.00</span></p>
            <p><strong>Low/No Available:</strong> <span id="DC_availability">0</span></p>
          </div>

          <!-- COSTS CARD -->
          <div class="summary-card costs-card">
            <h3>Daily Costs</h3>
            <p><strong>Total Cost:</strong> ₱<span id="DC_total">0.00</span></p>
            <p><strong>Withdrawals:</strong> <span id="DC_orders">0</span></p>
            <p><strong>Average Withdrawal:</strong> ₱<span id="DC_Average">0.00</span></p>
             <p><strong>Critical Items:</strong> <span id="DC_critical">0</span></p>
          </div>

        </div>

      <!-- ===== FOOTER ===== -->
      <div class="receipt-end">
        <p><strong>Report Generated Successfully</strong></p>
        <p>Keep this report for reference.</p>
        <br>
        <p>*** REPORT GENERATED ***</p>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="receipt-actions">
      <button class="print-btn" id="sendSMSBtn" onclick="showSalesReport()">SEND SMS ➤</button>
      <button class="print-btn" onclick="doPrintSalesReport()">🖨️ Print</button>
      <button class="close-btn" onclick="hideSalesReport()">Close</button>
    </div>
  </div>
</div>