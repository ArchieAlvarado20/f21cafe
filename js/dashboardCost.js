let transactionHistoryCosts = [];

function fetchSalesHistoryCost() {
  return fetch("actions/get_costs.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      transactionHistoryCosts = data
        .filter((row) => row.date_time.startsWith(today))
        .map((row) => ({
          id: row.id,
          date: row.date_time,
          items: row.items,
          total: row.total,
          payment: row.payment,
        }));

      return true;
    })
    .catch((error) => {
      console.error("Error loading sales:", error);
    });
}

function loadDashboardCost() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return;

  // 🇵🇭 PH TIME
  const nowPH = new Date(
    new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
  );
  const today = nowPH.toISOString().slice(0, 10);

  const todayTransactionsCosts = transactionHistoryCosts.filter((t) =>
    t.date.startsWith(today),
  );

  const totalRevenueCosts = todayTransactionsCosts.reduce(
    (sum, t) => sum + t.total,
    0,
  );
  const orderCountCosts = todayTransactionsCosts.length;
  const averageValueCosts =
    orderCountCosts > 0 ? totalRevenueCosts / orderCountCosts : 0;

  document.getElementById("today_costs").textContent =
    `₱${totalRevenueCosts.toFixed(2)}`;

  document.getElementById("total_orders_costs").textContent = orderCountCosts;
  document.getElementById("avg_order_costs").textContent =
    `₱${averageValueCosts.toFixed(2)}`;

  const recentDivCosts = document.getElementById("recent_transactions_costs");

  if (todayTransactionsCosts.length === 0) {
    recentDivCosts.innerHTML =
      '<p class="placeholder-text">No transactions today.</p>';
    return;
  }

  const reportCost = `
      DAILY COSTS REPORT:
      Total Cost: ₱${totalRevenueCosts.toFixed(2)}
      Withdrawals: ${orderCountCosts}
      Average Withdrawal: ₱${averageValueCosts.toFixed(2)}
      `;

  const recent = todayTransactionsCosts.slice(0, 5);

  recentDivCosts.innerHTML = recent
    .map(
      (t) => `
    <div style="padding: 1rem; border-bottom: 1px solid #eee;">
      <div style="display:flex; justify-content:space-between;">
        <div>
          <strong>${t.date}</strong>
          <p style="font-size:0.9rem; color:#666;">${t.items}</p>
        </div>
        <div style="text-align:right;">
          <div style="font-weight:700;">₱${t.total.toFixed(2)}</div>
         <div style="font-size:0.85rem; color:#666;">${t.payment}ed</div>
        </div>
      </div>
    </div>
  `,
    )
    .join("");

  return {
    totalRevenueCosts,
    orderCountCosts,
    averageValueCosts,
    reportCost,
    recentTransactionsCosts: todayTransactionsCosts,
  };
}

// bar graph data
let costsChart;
let allCosts = [];

// Fetch sales from PHP
function fetchCosts() {
  fetch("actions/get_costs.php") // 👈 ito yung PHP mo
    .then((res) => res.json())
    .then((data) => {
      allCosts = data;
      updateCostsChart(); // initial load
    })
    .catch((err) => console.error(err));
}

// Update chart based on dropdown
function updateCostsChart() {
  const filter = document.getElementById("costsFilter").value;
  const filteredData = filterCostsData(filter);

  const labels = filteredData.map((item) => item.label);
  const totals = filteredData.map((item) => item.total);

  // 🎨 color palette
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

  // 🟢 Create ONCE
  if (!costsChart) {
    const ctx_costs = document.getElementById("costsChart").getContext("2d");

    costsChart = new Chart(ctx_costs, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Costs (₱)", // ✅ Legend text
            data: totals,
            backgroundColor: dynamicColors, // ✅ different colors
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true, // ✅ show legend
            position: "bottom",
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return;
  }

  // 🟢 Update only (NO destroy)
  costsChart.data.labels = labels;
  costsChart.data.datasets[0].data = totals;
  costsChart.data.datasets[0].backgroundColor = dynamicColors; // ✅ update colors
  costsChart.update();
}

function toPHDate(dateString) {
  return new Date(
    new Date(dateString).toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
    }),
  );
}

// Filter logic
function filterCostsData(type) {
  const now = toPHDate(new Date());
  let map = {};

  allCosts.forEach((sale) => {
    const saleDate = toPHDate(sale.date_time);
    let key = "";
    let order = 0;

    // 🕒 TODAY → hourly (PH time)
    if (type === "day") {
      if (saleDate.toDateString() !== now.toDateString()) return;

      const hour = saleDate.getHours(); // PH hour
      const displayHour = hour % 12 || 12;
      const suffix = hour < 12 ? "AM" : "PM";

      key = `${displayHour}${suffix}`;
      order = hour; // 0–23 (correct order)
    }

    // 📅 WEEK → Sun–Sat (PH)
    if (type === "week") {
      // Start of current week (Sunday)
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(now.getDate() - now.getDay());

      // End of week (Saturday)
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);

      if (saleDate < start || saleDate > end) return;

      order = saleDate.getDay(); // 0–6
      key = saleDate.toLocaleDateString("en-PH", {
        weekday: "short",
        timeZone: "Asia/Manila",
      });
    }

    // 🗓️ MONTH → Week 1–4 (PH)
    if (type === "month") {
      if (
        saleDate.getMonth() !== now.getMonth() ||
        saleDate.getFullYear() !== now.getFullYear()
      )
        return;

      order = Math.ceil(saleDate.getDate() / 7);
      key = `Week ${order}`;
    }

    // 📆 YEAR → Jan–Dec (PH)
    if (type === "year") {
      if (saleDate.getFullYear() !== now.getFullYear()) return;

      order = saleDate.getMonth(); // 0–11
      key = saleDate.toLocaleDateString("en-PH", {
        month: "short",
        timeZone: "Asia/Manila",
      });
    }

    // 📆 ANNUAL → 2020–2025 (per year)
    if (type === "annual") {
      const year = saleDate.getFullYear();

      if (year < 2020 || year > 2027) return;

      key = year.toString(); // label will be 2020, 2021...
      order = year; // ensures correct sorting
    }

    // 📊 QUARTERLY → 2020–2026 (Q1–Q4 per year)
    if (type === "quarterly") {
      const year = saleDate.getFullYear();

      if (year < 2020 || year > 2026) return;

      const month = saleDate.getMonth(); // 0–11
      const quarter = Math.floor(month / 3) + 1; // 1–4

      key = `${year} Q${quarter}`;

      // ensures correct chronological sorting
      order = year * 10 + quarter;
    }

    if (!map[key]) {
      map[key] = { label: key, total: 0, order };
    }

    map[key].total += sale.total;
  });

  // 🔥 OLDEST → LATEST (correct order)
  return Object.values(map)
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      label: item.label,
      total: item.total,
    }));
}
// Load on page open
document.addEventListener("DOMContentLoaded", () => {
  fetchCosts(); // Now this runs after DOM is ready

  fetchSalesHistoryCost().then(() => {
    loadDashboardCost();
    inventoryMain();
  });
});
