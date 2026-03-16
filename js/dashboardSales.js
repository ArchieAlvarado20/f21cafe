let transactionHistorySales = [];
let productAvailability = 0;

function fetchHistorySales() {
  return fetch("actions/get_sales.php?t=" + new Date().getTime())
    .then((response) => response.json())
    .then((data) => {
      const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

      transactionHistorySales = data
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

function loadDashboard() {
  if (!loggedInUser || loggedInUser.role !== "Owner") return null;

  // 🇵🇭 PH TIME
  const nowPH = new Date(
    new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
  );
  const today = nowPH.toISOString().slice(0, 10);

  const todayTransactions = transactionHistory.filter((t) =>
    t.date.startsWith(today),
  );

  const lowStockCount = transactionHistory.filter(
    (item) => item.stock >= 1,
  ).length;
  document.getElementById("low_stock_count").textContent = lowStockCount;

  productAvailability = lowStockCount;

  const totalRevenue = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const orderCount = todayTransactions.length;
  const averageValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  document.getElementById("today_sales").textContent =
    `₱${totalRevenue.toFixed(2)}`;
  document.getElementById("today-sales-total").textContent =
    `₱${totalRevenue.toFixed(2)}`;
  document.getElementById("total_orders").textContent = orderCount;
  document.getElementById("avg_order").textContent =
    `₱${averageValue.toFixed(2)}`;

  const recentDiv = document.getElementById("recent_transactions");

  if (todayTransactions.length === 0) {
    recentDiv.innerHTML =
      '<p class="placeholder-text">No transactions today.</p>';
  } else {
    const report = `
      DAILY SALES REPORT:
      Total Sales: ₱${totalRevenue.toFixed(2)}
      Orders: ${orderCount}
      Average Order: ₱${averageValue.toFixed(2)}
    `;

    const recent = todayTransactions.slice(0, 5);
    recentDiv.innerHTML = recent
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
            <div style="font-size:0.85rem; color:#666;">${t.payment}</div>
          </div>
        </div>
      </div>
    `,
      )
      .join("");

    return {
      totalRevenue,
      orderCount,
      averageValue,
      report,
      recentTransactions: todayTransactions,
      lowStockCount,
    };
  }

  // fallback return if no transactions
  return {
    totalRevenue,
    orderCount,
    averageValue,
    report: "No transactions today.",
    recentTransactions: [],
    lowStockCount,
  };
}
