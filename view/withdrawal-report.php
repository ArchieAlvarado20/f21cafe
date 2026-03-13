<div id="withdraw_report_modal" class="receipt-popup">
  <div class="receipt-box-withdraw">
    <div class="receipt-print-withdraw" id="withdrawal_area">

      <!-- ===== REPORT HEADER ===== -->
      <div class="receipt-top">
        <h2>F21 CAFE</h2>
        <strong>Stock Withdrawal Report</strong>
        <p>123 Sample Street, Brgy. Demo, Quezon City</p>
      
        <p><strong>Date:</strong> <span id="receipt_time_withdraw"></span></p>
        <p><strong>Report No:</strong>  <span id="report_no"></span> </p>
        
      </div>


                <!-- ===== ITEMS ===== -->
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Batch No.</th>
                  <th>Expiry Date</th>
                  <th>Cost</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody id="receipt_lines_withdraw">
                <!-- JS will insert rows here -->
              </tbody>
            </table>
          </div>

      <!-- ===== SUMMARY ===== -->
      <div class="receipt-bottom">
          
        <div class="total-line">
          <span>Total Cost:</span>
          <span id="withdrawal_total_cost">0</span>
        </div>

        <div class="total-line">
          <span>Total Items Withdrawn:</span>
          <span id="total_qty">0</span>
        </div>
      

        <div class="total-line">
          <span>Handled By:</span>
          <span id="cashier_stock"></span>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <div class="receipt-end">
        
        <p><strong>Stock Withdrawal Recorded Successfully</strong></p>
        <p>Keep this report for reference.</p>
        <br>
        <p>*** REPORT GENERATED ***</p>
      </div>

    </div>

    <!-- ACTIONS -->
    <div class="receipt-actions">
      <button class="print-btn" onclick="doPrintWithdraw()">🖨️ Print</button>
      <button class="close-btn" onclick="hideReceiptWithdraw()">Close</button>
    </div>
  </div>
</div>