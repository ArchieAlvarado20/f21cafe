 <!-- ====================== POS SYSTEM ====================== -->
        <div id="pos-screen" class="screen-view">
            <div class="page-container">
                <div class="pos-wrapper">
                    <div class="pos-layout">

                        <!-- PRODUCT LIST -->
                        <div class="products-section">
                            <div class="content-box">
                                <div class="box-title">Menu Items</div>
                                <div class="box-content">

                                    <!-- Filter Buttons -->
                                   <div id="filter_buttons">
                                </div>

                                    <!-- Search Box -->
                                    <input type="text" id="search_box" class="search-field" placeholder="Search menu by name..." onkeyup="searchProducts()">

                                    <!-- Product Display -->
                                    <div id="products_list"></div>
                                </div>
                            </div>
                        </div>

                        <!-- ORDER SUMMARY -->
                        <div class="cart-section">
                            <div class="content-box">
                                <div class="box-title">Order Summary</div>
                                <div class="box-content">
                                    <div id="order_items">
                                        <p class="placeholder-text">Cart is empty.</p>
                                    </div>
                                    
                                        <!-- Payment Method -->
                                    <label for="payment_type" class="input-label">Payment Method</label>
                                    <select class="select-field" id="payment_type" onchange="handlePaymentMethod()">
                                        <option value="Cash">Cash</option>
                                        <option value="Gcash">Gcash</option>
                                        <option value="Paymaya">Paymaya</option>
                                    </select>

                                    <div id="total_section">
                                        <span style="font-weight: 700; font-size: 1.5rem;">TOTAL:</span>
                                        <span id="order_total">₱0.00</span>
                                    </div>

                                        <!-- CASH PANEL (HIDDEN BY DEFAULT) -->
                                    <div id="cash_section" style="display:block; margin-top: 0.8rem;">
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
                                    </div>
                                
                                

                                    <div id="notification"></div>
                                    <button   class="primary-btn"
                                                id="checkout_btn"
                                                onclick="processCheckout()">Order</button>
                                    <button class="secondary-btn" style="width: 100%; margin-top: 0.7rem;" onclick="emptyCart()">Clear Cart</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>