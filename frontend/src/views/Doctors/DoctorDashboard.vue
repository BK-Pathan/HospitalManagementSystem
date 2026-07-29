<script setup>

import { ref, computed, onMounted } from "vue";
import api from "../../api/axios";
import {
  Doughnut,
  Bar
} from "vue-chartjs";


import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";


ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ArcElement
);


// =====================
// CHART DATA
// =====================

const chartData = ref({
  labels: [
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
    "Total"
  ],
  datasets: [
    {
      label: "Appointments",
      backgroundColor: "#14b8a6",
      borderRadius: 8,
      maxBarThickness: 46,
      data: [0, 0, 0, 0, 0]
    }
  ]
});


const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
      grid: { color: "rgba(148,163,184,0.15)" }
    }
  }
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "68%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 10, padding: 16 }
    }
  }
};


// =====================
// STATES
// =====================

const upcomingAppointments = ref([]);
const todaysAppointments = ref([]);

const stats = ref({
  patients: 0,
  appointments: 0,
  pending: 0,
  confirmed: 0,
  completed: 0,
  cancelled: 0
});

const feedbackStats = ref({
  totalReviews: 0,
  averageRating: 0
});

// ✅ FIX: backgroundColor pehle chartData ke top level pe thi, jahan
// Chart.js use nahi karta. Ye dataset ke andar honi chahiye taake har
// slice ko color mile.
const feedbackChart = ref({
  labels: [
    "1 Star",
    "2 Star",
    "3 Star",
    "4 Star",
    "5 Star"
  ],
  datasets: [
    {
      label: "Reviews",
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        "#EF4444",
        "#F97316",
        "#EAB308",
        "#22C55E",
        "#0F766E"
      ],
      borderWidth: 0
    }
  ]
});


// =====================
// GREETING / DATE
// =====================

const today = new Date();

const greeting = computed(() => {
  const h = today.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
});

const formattedDate = computed(() =>
  today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
);


// =====================
// DASHBOARD STATS
// =====================

const getStats = async () => {
  try {
    const res = await api.get("/doctor/dashboard");
    console.log("Dashboard Data:", res.data);
    stats.value = res.data;
  } catch (error) {
    console.log("Dashboard Error:", error.response?.data || error.message);
  }
};


// =====================
// TODAY APPOINTMENTS
// =====================

const getTodaysAppointments = async () => {
  try {
    const res = await api.get("/doctor/today-appointments");
    console.log("Today's Appointments:", res.data);
    todaysAppointments.value = res.data;
  } catch (error) {
    console.log("Today Error:", error.response?.data || error.message);
  }
};


// =====================
// UPCOMING
// =====================

const getUpcomingAppointments = async () => {
  try {
    const res = await api.get("/doctor/upcoming-appointments");
    console.log("Upcoming:", res.data);
    upcomingAppointments.value = res.data;
  } catch (error) {
    console.log("Upcoming Error:", error.response?.data || error.message);
  }
};


// =====================
// ANALYTICS
// =====================

const getAnalytics = async () => {
  try {
    const res = await api.get("/doctor/appointment-analytics");
    console.log("Analytics Data:", res.data);

    chartData.value = {
      labels: [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Total"
      ],
      datasets: [
        {
          label: "Appointments",
          backgroundColor: "#14b8a6",
          borderRadius: 8,
          maxBarThickness: 46,
          data: [
            res.data.pending || 0,
            res.data.confirmed || 0,
            res.data.completed || 0,
            res.data.cancelled || 0,
            res.data.total || 0
          ]
        }
      ]
    };
  } catch (error) {
    console.log("Analytics Error:", error.response?.data || error.message);
  }
};


// =====================
// FEEDBACK ANALYTICS
// =====================

const getFeedbackAnalytics = async () => {
  try {
    const res = await api.get("/doctor/feedback-analytics");
    console.log("Feedback Analytics:", res.data);

    feedbackStats.value = {
      totalReviews: res.data.totalReviews || 0,
      averageRating: res.data.averageRating || 0
    };

    // ✅ FIX: pura naya object assign kiya (sirf .data array mutate
    // karne se Doughnut chart re-render nahi hota) + ratingDistribution
    // ke missing keys ke liye fallback 0 laga diya taake undefined na aaye
    const dist = res.data.ratingDistribution || {};

    feedbackChart.value = {
      labels: [
        "1 Star",
        "2 Star",
        "3 Star",
        "4 Star",
        "5 Star"
      ],
      datasets: [
        {
          label: "Reviews",
          data: [
            dist[1] || 0,
            dist[2] || 0,
            dist[3] || 0,
            dist[4] || 0,
            dist[5] || 0
          ],
          backgroundColor: [
            "#EF4444",
            "#F97316",
            "#EAB308",
            "#22C55E",
            "#0F766E"
          ],
          borderWidth: 0
        }
      ]
    };
  } catch (error) {
    console.log("Feedback Analytics Error:", error.response?.data || error.message);
  }
};


// =====================
// HELPERS (display only — no backend / data changes)
// =====================

const initials = (name) => {
  if (!name || name === "N/A") return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};

const statusClass = (status) => `status status--${(status || "").toLowerCase()}`;


onMounted(() => {
  getStats();
  getTodaysAppointments();
  getUpcomingAppointments();
  getAnalytics();
  getFeedbackAnalytics();
});

</script>

<template>

  <div class="dashboard-page">

    <!-- =====================
    HEADER
    ===================== -->

    <div class="page-header">
      <div>
        <p class="eyebrow">{{ greeting }}, Doctor</p>
        <h2 class="page-title">Dashboard Overview</h2>
      </div>
      <div class="header-meta">
        <span class="date-pill">{{ formattedDate }}</span>
      </div>
    </div>


    <!-- =====================
    STATS CARDS
    ===================== -->

    <div class="cards">

      <div class="stat-card">
        <div class="stat-icon stat-icon--patients">
          <svg viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Patients</h3>
          <h1>{{ stats.patients }}</h1>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--pending">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Pending</h3>
          <h1>{{ stats.pending }}</h1>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--confirmed">
          <svg viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/></svg>
        </div>
        <div class="stat-body">
          <h3>Confirmed</h3>
          <h1>{{ stats.confirmed }}</h1>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--completed">
          <svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Completed</h3>
          <h1>{{ stats.completed }}</h1>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--cancelled">
          <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Cancelled</h3>
          <h1>{{ stats.cancelled }}</h1>
        </div>
      </div>

      <!-- Feedback Cards -->

      <div class="stat-card">
        <div class="stat-icon stat-icon--rating">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.9 6.4 7 .7-5.2 4.8 1.5 6.9L12 17.3 5.8 20.8l1.5-6.9L2.1 9.1l7-.7L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Average Rating</h3>
          <h1>{{ feedbackStats.averageRating }}<span class="unit">/5</span></h1>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon stat-icon--reviews">
          <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        </div>
        <div class="stat-body">
          <h3>Total Reviews</h3>
          <h1>{{ feedbackStats.totalReviews }}</h1>
        </div>
      </div>

    </div>


    <!-- =====================
    TODAY APPOINTMENTS
    ===================== -->

    <div class="section-head">
      <h2 class="section-title">Today's Appointments</h2>
      <span class="section-count" v-if="todaysAppointments.length">{{ todaysAppointments.length }} scheduled</span>
    </div>

    <div class="table-card">

      <table class="appointments-table" v-if="todaysAppointments.length">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Problem</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in todaysAppointments" :key="item._id">
            <td>
              <div class="patient-cell">
                <span class="avatar">{{ initials(item.patient?.user?.name) }}</span>
                {{ item.patient?.user?.name || "N/A" }}
              </div>
            </td>
            <td>{{ item.patient?.DescribeYourProblem || "N/A" }}</td>
            <td>
              {{
                new Date(item.appointmentDateTime)
                  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }}
            </td>
            <td>
              <span :class="statusClass(item.status)">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p>No appointments today.</p>
      </div>

    </div>


    <!-- =====================
    ANALYTICS
    ===================== -->

    <div class="section-head">
      <h2 class="section-title">Analytics</h2>
    </div>

    <div class="analytics-grid">

      <div class="chart-card">
        <div class="chart-card__head">
          <h3>Appointment Breakdown</h3>
          <p>Status distribution across all appointments</p>
        </div>
        <div class="chart-wrap chart-wrap--bar">
          <Bar
            :key="chartData.datasets[0].data.join('-')"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-card__head">
          <h3>Patient Feedback</h3>
          <p>{{ feedbackStats.totalReviews }} reviews · {{ feedbackStats.averageRating }}★ average</p>
        </div>
        <div class="chart-wrap chart-wrap--doughnut">
          <Doughnut
            :key="feedbackChart.datasets[0].data.join('-')"
            :data="feedbackChart"
            :options="doughnutOptions"
          />
        </div>
      </div>

    </div>


    <!-- =====================
    UPCOMING APPOINTMENTS
    ===================== -->

    <div class="section-head">
      <h2 class="section-title">Upcoming Appointments</h2>
      <span class="section-count" v-if="upcomingAppointments.length">{{ upcomingAppointments.length }} upcoming</span>
    </div>

    <div class="table-card">

      <table class="appointments-table" v-if="upcomingAppointments.length">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Problem</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in upcomingAppointments" :key="item._id">
            <td>
              <div class="patient-cell">
                <span class="avatar">{{ initials(item.patient?.user?.name) }}</span>
                {{ item.patient?.user?.name || "N/A" }}
              </div>
            </td>
            <td>{{ item.patient?.DescribeYourProblem || "N/A" }}</td>
            <td>{{ new Date(item.appointmentDateTime).toLocaleDateString() }}</td>
            <td>
              {{
                new Date(item.appointmentDateTime)
                  .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              }}
            </td>
            <td>
              <span :class="statusClass(item.status)">{{ item.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="empty-state" v-else>
        <svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <p>No upcoming appointments.</p>
      </div>

    </div>

  </div>

</template>


<style scoped>

.dashboard-page {
  min-height: 100%;
}

/* ---------- Header ---------- */

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px;
}

.page-title {
  font-size: 30px;
  color: var(--text);
  margin: 0;
}

.date-pill {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 999px;
  background: var(--white);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  color: var(--muted);
  font-size: 14px;
  font-weight: 500;
}

/* ---------- Stat cards (Premium) ---------- */

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.stat-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 24px 22px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  overflow: hidden;
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1);
}

.stat-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  opacity: 0;
  transition: opacity .3s ease;
}

.stat-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 20px 30px -12px rgba(15, 23, 42, 0.16);
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-icon {
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5),
              0 6px 14px -6px rgba(0,0,0,.15);
  transition: transform .3s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.08) rotate(-2deg);
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  position: relative;
  z-index: 1;
}

.stat-icon--patients  { background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06)); color: var(--primary); }
.stat-icon--pending   { background: linear-gradient(135deg, rgba(234,179,8,.20), rgba(234,179,8,.06)); color: #ca8a04; }
.stat-icon--confirmed { background: linear-gradient(135deg, rgba(59,130,246,.20), rgba(59,130,246,.06)); color: #2563eb; }
.stat-icon--completed { background: linear-gradient(135deg, rgba(34,197,94,.20), rgba(34,197,94,.06)); color: #16a34a; }
.stat-icon--cancelled { background: linear-gradient(135deg, rgba(239,68,68,.20), rgba(239,68,68,.06)); color: #dc2626; }
.stat-icon--rating    { background: linear-gradient(135deg, rgba(234,179,8,.20), rgba(234,179,8,.06)); color: #ca8a04; }
.stat-icon--reviews   { background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06)); color: var(--primary); }

.stat-body h3 {
  color: var(--muted);
  font-size: 12.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .05em;
  margin: 0 0 8px;
}

.stat-body h1 {
  color: var(--text);
  font-size: 29px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  letter-spacing: -.02em;
}

.stat-body h1 .unit {
  font-size: 15px;
  color: var(--muted);
  font-weight: 500;
  margin-left: 2px;
}

/* ---------- Section headers ---------- */

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: 34px;
  margin-bottom: 14px;
}

.section-title {
  color: var(--text);
  font-size: 20px;
  margin: 0;
}

.section-count {
  font-size: 13px;
  color: var(--muted);
  font-weight: 500;
}

/* ---------- Table card ---------- */

.table-card {
  background: var(--white);
  padding: 10px 24px 24px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow-x: auto;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table thead th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-weight: 700;
  text-align: left;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
  background: transparent;
}

.appointments-table td {
  padding: 16px 12px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.appointments-table tbody tr:last-child td {
  border-bottom: none;
}

.appointments-table tbody tr:hover {
  background: #f8fafc;
}

.patient-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.avatar {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  text-transform: capitalize;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
}

.status--pending { background: rgba(234, 179, 8, .15); color: #ca8a04; }
.status--confirmed { background: rgba(59, 130, 246, .15); color: #2563eb; }
.status--completed { background: rgba(34, 197, 94, .15); color: #16a34a; }
.status--cancelled { background: rgba(239, 68, 68, .15); color: #dc2626; }

/* ---------- Empty state ---------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 50px 20px;
  color: var(--muted);
}

.empty-state svg {
  width: 36px;
  height: 36px;
  opacity: .6;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ---------- Analytics ---------- */

.analytics-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 22px;
}

.chart-card {
  background: var(--white);
  padding: 24px;
  border-radius: 18px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.chart-card__head h3 {
  margin: 0 0 4px;
  color: var(--text);
  font-size: 16px;
}

.chart-card__head p {
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 13px;
}

.chart-wrap {
  position: relative;
  width: 100%;
}

.chart-wrap--bar {
  height: 280px;
}

.chart-wrap--doughnut {
  height: 280px;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .cards{
    grid-template-columns: repeat(4,1fr);
    gap:18px;
  }

  .stat-card{
    padding:20px;
  }

}

/* ==========================
   Laptop
========================== */

@media (max-width:1200px){

  .cards{
    grid-template-columns:repeat(3,1fr);
  }

  .analytics-grid{
    grid-template-columns:1fr;
  }

  .chart-wrap--bar,
  .chart-wrap--doughnut{
    height:320px;
  }

}

/* ==========================
   Tablet
========================== */

@media (max-width:992px){

  .page-title{
    font-size:26px;
  }

  .cards{
    grid-template-columns:repeat(2,1fr);
    gap:18px;
  }

  .stat-card{
    padding:18px;
  }

  .stat-body h1{
    font-size:24px;
  }

  .table-card{
    padding:10px 16px 20px;
  }

  .appointments-table{
    min-width:700px;
  }

}

/* ==========================
   Mobile
========================== */

@media (max-width:768px){

  .dashboard-page{
    padding:0;
  }

  .page-header{
    flex-direction:column;
    align-items:flex-start;
    gap:14px;
    margin-bottom:24px;
  }

  .page-title{
    font-size:24px;
  }

  .date-pill{
    width:100%;
    justify-content:center;
  }

  .cards{
    grid-template-columns:repeat(2,1fr);
    gap:16px;
  }

  .stat-card{
    padding:16px;
    gap:12px;
    border-radius: 16px;
  }

  .stat-body h3{
    font-size:11px;
  }

  .stat-body h1{
    font-size:22px;
  }

  .stat-icon{
    width:42px;
    height:42px;
    border-radius: 12px;
  }

  .stat-icon svg{
    width:20px;
    height:20px;
  }

  .section-head{
    flex-direction:column;
    align-items:flex-start;
    gap:6px;
  }

  .chart-card{
    padding:18px;
  }

  .chart-wrap--bar{
    height:260px;
  }

  .chart-wrap--doughnut{
    height:240px;
  }

}

/* ==========================
   Small Mobile
========================== */

@media (max-width:480px){

  .page-title{
    font-size:21px;
  }

  .eyebrow{
    font-size:11px;
  }

  .date-pill{
    font-size:13px;
    padding:9px 14px;
  }

  .stat-card{
    gap:14px;
    padding:16px;
    border-radius: 14px;
  }

  .stat-icon{
    width:44px;
    height:44px;
  }

  .stat-icon svg{
    width:20px;
    height:20px;
  }

  .stat-body h3{
    font-size:12px;
  }

  .stat-body h1{
    font-size:22px;
  }

  .table-card{
    padding:8px 12px 16px;
  }

  .appointments-table td,
  .appointments-table th{
    padding:14px 10px;
    font-size:13px;
  }

  .avatar{
    width:30px;
    height:30px;
    font-size:11px;
  }

  .status{
    font-size:11px;
    padding:5px 10px;
  }

  .chart-wrap--bar{
    height:230px;
  }

  .chart-wrap--doughnut{
    height:220px;
  }

}

</style>