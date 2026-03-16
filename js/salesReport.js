function salesReport() {
  document.getElementById("sales_report_modal").classList.add("show");
  generateReportNo();
  document.getElementById("receipt_time_report").textContent =
    new Date().toLocaleString();

  //Sales Report
  const dashboardData = loadDashboard();

  document.getElementById("TS_report").textContent =
    dashboardData.totalRevenue.toFixed(2);
  document.getElementById("TO_report").textContent = dashboardData.orderCount;
  document.getElementById("AV_report").textContent =
    dashboardData.averageValue.toFixed(2);

  //Cost Report
  const dashboardDataCost = loadDashboardCost();

  document.getElementById("DC_total").textContent =
    dashboardDataCost.totalRevenueCosts.toFixed(2);
  document.getElementById("DC_orders").textContent =
    dashboardDataCost.orderCountCosts;
  document.getElementById("DC_Average").textContent =
    dashboardDataCost.averageValueCosts.toFixed(2);

  const criticalItems = document.getElementById("DC_critical").textContent;

  const criticalProducts =
    document.getElementById("DC_availability").textContent;

  document.getElementById("low_stock_count").textContent = criticalProducts;

  //report main info
  let name =
    loggedInUser.username.charAt(0).toUpperCase() +
    loggedInUser.username.slice(1);

  if (loggedInUser.role === "Owner") {
    name = "Yhaj Catinguel Uranza";
  }

  document.getElementById("cashier_report").textContent = name;
  document.getElementById("sendSMSBtn").addEventListener("click", function () {
    try {
      const now = new Date();
      const longDate = now.toLocaleDateString("en-PH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      inventoryMain();
      const report_no = generateReportNo();
      const report = loadDashboard();
      const reportCost = loadDashboardCost();

      const fullReport = `
    F_21 CAFE

    ${longDate}
    ${report_no}
    ${report.report} 
    No/Low Availability: ${criticalProducts}
    ------------------------
    ${reportCost.reportCost}
    Critical Items: ${criticalItems}
    Handled by: ${name}`;
      sendSMS(fullReport);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "SMS Sent Successfully",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        toast: true,
      });
    } catch (err) {
      console.error("Failed to generate report:", err);
    }
  });
}

function hideSalesReport() {
  document.getElementById("sales_report_modal").classList.remove("show");
}

function sendSMS(message) {
  //archie
  const API_KEY = "f1673f69-42ab-4dee-a9ce-1acdfeb1d4f6";
  const owners = ["09619826022"];

  fetch(
    "https://api.textbee.dev/api/v1/gateway/devices/69ad36aa937185499c44e77a/send-sms",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        recipients: owners,
        message: message,
      }),
    },
  )
    .then((res) => res.json())
    .then((data) => console.log(data));

  fetchSalesHistory().then(() => {
    loadDashboard();
    loadInventory();
  });
}
let profitChart = null; // global para ma-update

function updateProfitChart() {
  const filterValue = document.getElementById("profitFilter").value;
  const filteredSales = filterSalesData(filterValue);
  const filteredCosts = filterCostsData(filterValue);

  // labels
  const labels = filteredSales.map((s) => s.label);

  // compute profit
  const profits = filteredSales.map((s) => {
    const costItem = filteredCosts.find((c) => c.label === s.label);
    const cost = costItem ? costItem.total : 0;
    return s.total - cost;
  });

  // chart context
  const ctx_profit = document.getElementById("profitChart").getContext("2d");

  // colors
  const colors = [
    "#4e73df",
    "#1cc88a",
    "#36b9cc",
    "#f6c23e",
    "#e74a3b",
    "#858796",
    "#20c997",
    "#fd7e14",
    "#6f42c1",
    "#d63384",
  ];
  const dynamicColors = labels.map((_, i) => colors[i % colors.length]);

  // create or update chart
  if (!profitChart) {
    profitChart = new Chart(ctx_profit, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Profit (₱)",
            data: profits,
            backgroundColor: dynamicColors,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: "bottom" },
        },
        scales: { y: { beginAtZero: true } },
      },
    });
  } else {
    profitChart.data.labels = labels;
    profitChart.data.datasets[0].data = profits;
    profitChart.data.datasets[0].backgroundColor = dynamicColors;
    profitChart.update();
  }
}

function computeTodayProfit() {
  const revenue = Number(loadDashboard()?.totalRevenue) || 0;
  const cost = Number(loadDashboardCost()?.totalRevenueCosts) || 0;

  return revenue - cost;
}

function doPrintSalesReport() {
  window.print();
}
