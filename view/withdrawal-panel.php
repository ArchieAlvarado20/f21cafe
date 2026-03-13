 <!-- ====================== POS SYSTEM ====================== -->
        <div id="withdraw-screen" class="screen-view">
            <div class="page-container">
                 <div id="expiry-legend" style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap;">
                        <strong>Expiration:</strong>
                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:15px; height:15px; background-color:#d30909; border:1px solid #000;"></div>
                            <span>Less than 7 days</span>
                        </div>

                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:15px; height:15px; background-color:#fad70e; border:1px solid #000;"></div>
                            <span>7–30 days left</span>
                        </div>

                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:15px; height:15px; background-color:#39aa00; border:1px solid #000;"></div>
                            <span>More than 30 days left</span>
                        </div>

                        <div style="display:flex; align-items:center; gap:5px;">
                            <div style="width:15px; height:15px; background-color:#5c5e5cd2; border:1px solid #000;"></div>
                            <span>Expired</span>
                        </div>
                        </div>
                <div class="withdraw-wrapper">
                    <div class="withdraw-layout">

                        <!-- PRODUCT LIST -->
                        <div class="products-section">
                            <div class="content-box">
                                <div class="box-title">Inventory Items </div>
                                <div class="box-content">

                                    <!-- Filter Buttons -->
                                   <div id="filter_buttons_withdraw">
                                </div>

                                    <!-- Search Box -->
                                    <input type="text" id="stock_search_box" class="search-field" placeholder="Search menu by name..." onkeyup="searchWithdraw()">

                                    <!-- Product Display -->
                                    <div id="stock_list"></div>
                                </div>
                            </div>
                        </div>

                        <!-- ORDER SUMMARY -->
                        <div class="cart-section">
                            <div class="content-box">
                                <div class="box-title">Withdrawal Summary</div>
                                <div class="box-content-withdraw">
                                    <div id="order_items_withdraw">
                                        <p class="placeholder-text">Cart is empty.</p>
                                    </div>
                                    
                                        <!-- Payment Method -->
                                    <!-- <label for="payment_type" class="input-label">Payment Method</label>
                                    <select class="select-field" id="payment_type" onchange="handlePaymentMethod()">
                                        <option value="Cash">Cash</option>
                                        <option value="Gcash">Gcash</option>
                                        <option value="Paymaya">Paymaya</option>
                                    </select> -->

                                    <div id="total_section_withdraw">
                                        <span style="font-weight: 700; font-size: 1.5rem;">TOTAL:</span>
                                        <span id="order_total_withdraw">₱0.00</span>
                                    </div>

                                        <!-- CASH PANEL (HIDDEN BY DEFAULT) -->
                                    <!-- <div id="cash_section" style="display:block; margin-top: 0.8rem;">
                                        <label class="input-label">Cash Received</label>
                                        <input
                                            type="number"
                                            id="cash_received"
                                            class="search-field"
                                            min="0"
                                            placeholder="Enter cash amount"
                                             oninput="updateCashComputation()"
                                        >
                                    <div id="total_section">
                                        <span style="font-weight: 700; font-size: 1.5rem;">CHANGE:</span>
                                        <span id="cash_change" style="font-weight: 700; font-size: 1.5rem;">₱0.00</span>
                                    </div>
                                    </div> -->
                                
                                    <div id="notificationWithdraw"></div>
                                    <button   class="primary-btn"
                                                id="checkout_btn"
                                                onclick="processCheckoutWithdraw()">Withdraw Items</button>
                                    <button class="secondary-btn" style="width: 100%; margin-top: 0.7rem;" onclick="emptyCartWithdraw()">Clear Cart</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>