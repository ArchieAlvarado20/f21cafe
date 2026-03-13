<div id="receipt_modal" class="receipt-popup">
  <div class="receipt-box">
    <div class="receipt-print" id="print_area">

      <!-- ===== RECEIPT HEADER ===== -->
      <div class="receipt-top">
        <h2>F21 CAFE</h2>
        <p>Food & Beverage Services</p>
        <p>123 Sample Street, Brgy. Demo, Quezon City</p>
        <p>Tel: 0912-345-6789</p>

        <hr>

        <p><strong>VAT REG TIN:</strong> 000-000-000-000</p>
        <p><strong>Accreditation No:</strong> ACC-123456789</p>
        <p><strong>Date Issued:</strong> <span id="receipt_time"></span></p>
        <p><strong>OR No:</strong> 00001234</p>

        <hr>
      </div>

      <!-- ===== ITEMS ===== -->
      <div class="receipt-lines" id="receipt_lines"></div>

      <!-- ===== TOTALS ===== -->
      <div class="receipt-bottom">
        <div class="total-line">
          <span>Subtotal:</span>
          <span id="receipt_sub">₱0.00</span>
        </div>

        <div class="total-line">
          <span>VATable Sales:</span>
          <span id="receipt_vatable">₱0.00</span>
        </div>

        <div class="total-line">
          <span>VAT (12%):</span>
          <span id="receipt_vat">₱0.00</span>
        </div>

        <div class="total-line bold-line">
          <span>TOTAL:</span>
          <span id="receipt_total">₱0.00</span>
        </div>

        <div class="total-line bold-line" id="receipt_payment_row">
          <span>PAYMENT:</span>
          <span id="receipt_payment">₱0.00</span>
        </div>

        <div class="total-line bold-line" id="receipt_change_row">
          <span>CHANGE:</span>
          <span id="receipt_change">₱0.00</span>
        </div>

        <div class="total-line">
          <span>Payment Method:</span>
          <span id="receipt_method"></span>
        </div>

          <div class="total-line">
          <span>Cashier:</span>
          <span id="cashier"></span>
        </div>
      </div>

      <!-- ===== FOOTER ===== -->
      <div class="receipt-end">
        <hr>
        <p><strong>THIS SERVES AS YOUR OFFICIAL RECEIPT</strong></p>
        <p>Thank you for dining with us!</p>
        <p>Please keep this receipt for your reference.</p>

        <br>

        <p>POS Provider: Sample POS System</p>
        <p>Permit to Use No: PTU-000000</p>
        <p>Date Issued: 01/01/2024</p>
        <p>Valid Until: 12/31/2028</p>

        <br>

        <p>*** ORDER COMPLETED ***</p>
      </div>

    </div>

    <!-- ACTIONS -->
    <div class="receipt-actions">
      <button class="print-btn" onclick="doPrint()">🖨️ Print</button>
      <button class="close-btn" onclick="hideReceipt()">Close</button>
    </div>
  </div>
</div>