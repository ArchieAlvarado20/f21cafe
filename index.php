<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Meta and Title -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>F21 Cafe POS</title>

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">

    <link rel="icon" href="images/logo.png" type="image/png" />

    <!-- ✅ Linked CSS -->
    <link rel="stylesheet" href="css/style.css?v=<?php echo time(); ?>">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
     <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

</head>
<body>
    
   <?php require "view/login.php"?>
    
    <!-- ====================== MAIN APP CONTAINER ====================== -->
    <div id="app-container" style="display: none;">

         <!-- ====================== OWNER PANEL ====================== -->
        <div class="owner-panel" id="owner_panel" style="display: none;">

               <?php require "view/sidebar.php"?>

            <!-- ====================== MAIN CONTENT AREA ====================== -->
            <div class="content-area">
                  <div id="dashboard-screen" class="screen-view" style="display: none;">
                     <button id="btn-sales"  class="dashboard-btn active" onclick="showSales()" style="margin-bottom: 1rem;">SALES</button>
                     <button id="btn-costs"  class="dashboard-btn" onclick="showCost()" style="margin-bottom: 1rem;">COSTS</button>
                     <button id="btn-profit" class="dashboard-btn" onclick="showProfit()" style="margin-bottom: 1rem;">PROFIT PREVIEW</button>
                      <button id="btn-p" class="dashboard-btn" onclick="salesReport()" style="margin-bottom: 1rem;">SALES REPORT</button>
                      <?php require "view/dashboard.php"?>
                      <?php require "view/dashboard-cost.php"?> 
                      <?php require "view/dashboard-profit.php"?> 
                    </div>
               
                <!-- SALES REPORT -->
                <div id="sales-screen" class="screen-view" style="display: none;">
                    <div class="section-header">
                        <h2 style="color: #000000;">Sales Report</h2>
                        <p style="color: #666666;">Complete transaction history and analytics</p>
                        <button class="add-btn" onclick="show_daily_Sales()" id="today-sales-btn">Today Sales</button>
                        <button class="add-btn" onclick="show_product_Sales()" id="today-sales-btn">Product Reports</button>
                    </div>
                              <?php require "view/sales-list.php"?>
                              <?php require "view/sales-report.php"?>
                </div>
                        
                              <?php require "view/product-report-modal.php"?>
                              <?php require "view/product-list.php"?>
                              <?php require "view/inventory-main.php"?>
                              <?php require "view/category.php"?>
                     
            </div>  
        </div>

        <!-- MOBILE MENU BUTTON -->
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">☰</button>

        <!-- STAFF NAVIGATION BAR -->
                             <?php require "view/pos-staff.php"?>
     
    <!-- ====================== POS SYSTEM ====================== -->
                        <?php require "view/pos.php"?>
                        <?php require "view/withdrawal-panel.php"?>
    </div>

    <!-- ====================== PRODUCT ADD / EDIT MODAL ====================== -->
                        <?php require "view/product_add_edit_modal.php"?>

    <!-- ====================== STOCKS ADD / EDIT MODAL ====================== -->
                        <?php require "view/add_edit_modal_main.php"?>

    <!-- ====================== STOCKS ADD ITEM ====================== -->
                        <?php require "view/add_stock_modal.php"?>

    <!-- ====================== ARCHIVED MODAL ====================== -->
                        <?php require "view/product_archived_modal.php"?>

    <!-- ====================== STOCKS ARCHIVED MODAL ====================== -->
                        <?php require "view/inventory_archived_modal.php"?>

    <!-- ====================== CATEGORY ARCHIVED MODAL ====================== -->
                        <?php require "view/inventory_category_modal.php"?>

    <!-- ====================== RECEIPT POPUP ====================== -->
                        <?php require "view/reciept.php"?>

    <!-- ====================== WITHDRAW POPUP ====================== -->
                        <?php require "view/withdrawal-report.php"?>

                        
    <!-- ====================== SALES REPORT POPUP ====================== -->
                        <?php require "view/daily-sales-report.php"?>

   
    
     <script src="js/script.js?"></script>
     <script src="js/category.js?"></script>    
     <script src="js/router.js"></script>
     <script src="js/session.js"></script>
     <script src="js/inventory.js?"></script>
     <script src="js/inventory_archived.js?"></script>
     <script src="js/product.js?"></script>
     <script src="js/withdraw.js"></script>
     <script src="js/dashboardCost.js"></script>
     <script src="js/dashboardSales.js"></script>
     <script src="js/salesReport.js"></script>
      
</body>
</html>
