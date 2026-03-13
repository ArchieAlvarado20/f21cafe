<aside class="side-menu" id="side_menu">
                <div class="toggle-wrapper">
                    <button class="menu-toggle" onclick="toggleMenu()">◄</button>
                </div>
                
                <!-- Brand Section -->
                <div class="brand-section">
                    <div class="brand-name">F21 CAFE</div>
                    <div class="brand-year">EST 2023</div>
                </div>
                
                <div class="menu-header">
                    <span class="header-text">ADMIN PANEL</span>
                </div>
                
                <!-- Menu List -->
                <ul class="menu-list">
                    <li class="menu-option">
                        <a class="menu-link active" data-screen="dashboard" onclick="switchScreen('dashboard'),showSales()">
                            <span class="link-icon">📊</span>
                            <span class="link-label">Dashboard</span>
                        </a>
                    </li>
                      <li class="menu-option">
                        <a class="menu-link" data-screen="pos" onclick="switchScreen('pos')">
                            <span class="link-icon">💻</span>
                            <span class="link-label">POS SYSTEM</span>
                        </a>
                    </li>
                    <li class="menu-option">
                        <a class="menu-link" data-screen="withdraw" onclick="switchScreen('withdraw')">
                            <span class="link-icon">🛒</span>
                            <span class="link-label">Stocks Withdrawal Panel</span>
                        </a>
                    </li>
                    <li class="menu-option">
                        <a class="menu-link" data-screen="sales" onclick="switchScreen('sales')">
                            <span class="link-icon">💰</span>
                            <span class="link-label">Sales Report</span>
                        </a>
                    </li>
                     <li class="menu-option">
                        <a class="menu-link"  data-screen="category-main" onclick="switchScreen('category-main')">
                            <span class="link-icon">🏷️</span>
                            <span class="link-label">Category</span>
                        </a>
                    </li>
                    <li class="menu-option">
                        <a class="menu-link"  data-screen="inventory" onclick="switchScreen('inventory')">
                            <span class="link-icon">🍝</span>
                            <span class="link-label">Product</span>
                        </a>
                    </li>
                    <li class="menu-option">
                        <a class="menu-link"  data-screen="inventory-main" onclick="switchScreen('inventory-main')">
                            <span class="link-icon">📦</span>
                            <span class="link-label">Inventory</span>
                        </a>
                    </li>
                    <li class="menu-option" style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
                        <a class="menu-link" onclick="doLogout()">
                            <span class="link-icon">🚪</span>
                            <span class="link-label">Logout</span>
                        </a>
                    </li>
                </ul>
            </aside>