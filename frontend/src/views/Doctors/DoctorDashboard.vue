<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";
import {
Doughnut
} from "vue-chartjs";
import {
  Bar
} from "vue-chartjs";


import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from "chart.js";


ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import {

ArcElement

}

from "chart.js";


ChartJS.register(

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
      data: [0, 0, 0, 0, 0]
    }
  ]
});


const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: true,
      text: "Appointment Analytics"
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

totalReviews:0,

averageRating:0

});



const feedbackChart = ref({

labels:[

"1 Star",

"2 Star",

"3 Star",

"4 Star",

"5 Star"

],


datasets:[{

label:"Reviews",

data:[0,0,0,0,0]

}],


});

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

    // ✅ FIX: pura naya object assign kar rahe hain (sirf nested array
    // mutate karne se vue-chartjs reliably re-render nahi karta)
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
const getFeedbackAnalytics = async()=>{


try{


const res = await api.get(
"/doctor/feedback-analytics"
);



console.log(
"Feedback Analytics:",
res.data
);



feedbackStats.value={

totalReviews:res.data.totalReviews,

averageRating:res.data.averageRating

};



feedbackChart.value.datasets[0].data=[

res.data.ratingDistribution[1],

res.data.ratingDistribution[2],

res.data.ratingDistribution[3],

res.data.ratingDistribution[4],

res.data.ratingDistribution[5]

];



}

catch(error){


console.log(
error.response?.data || error.message
);


}


};

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


<h2 class="page-title">
Doctor Dashboard
</h2>



<!-- =====================
STATS CARDS
===================== -->

<div class="cards">


<div class="stat-card">

<h3>
Patients
</h3>

<h1>
{{stats.patients}}
</h1>

</div>



<div class="stat-card">

<h3>
Pending
</h3>

<h1>
{{stats.pending}}
</h1>

</div>



<div class="stat-card">

<h3>
Confirmed
</h3>

<h1>
{{stats.confirmed}}
</h1>

</div>



<div class="stat-card">

<h3>
Completed
</h3>

<h1>
{{stats.completed}}
</h1>

</div>



<div class="stat-card">

<h3>
Cancelled
</h3>

<h1>
{{stats.cancelled}}
</h1>

</div>



<!-- Feedback Cards -->


<div class="stat-card">

<h3>
Average Rating
</h3>


<h1>
⭐ {{feedbackStats.averageRating}}
</h1>


</div>




<div class="stat-card">

<h3>
Total Reviews
</h3>


<h1>
{{feedbackStats.totalReviews}}
</h1>


</div>



</div>





<!-- =====================
TODAY APPOINTMENTS
===================== -->


<h2 class="section-title">

📅 Today's Appointments

</h2>




<div class="table-card">


<table 
class="appointments-table"
v-if="todaysAppointments.length"
>


<tr>

<th>
Patient
</th>


<th>
Problem
</th>


<th>
Time
</th>


<th>
Status
</th>


</tr>



<tr
v-for="item in todaysAppointments"
:key="item._id"
>


<td>

{{item.patient?.user?.name || "N/A"}}

</td>



<td>

{{item.patient?.DescribeYourProblem || "N/A"}}

</td>



<td>

{{
new Date(item.appointmentDateTime)
.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
}}

</td>



<td>

<span class="status">

{{item.status}}

</span>

</td>


</tr>


</table>


<p v-else>

No appointments today.

</p>



</div>





<!-- =====================
APPOINTMENT ANALYTICS
===================== -->


<h2 class="section-title">

📊 Appointment Analytics

</h2>



<div class="table-card">


<Bar

:key="chartData.datasets[0].data.join('-')"

:data="chartData"

:options="chartOptions"

/>


</div>






<!-- =====================
FEEDBACK ANALYTICS
===================== -->


<h2 class="section-title">

⭐ Patient Feedback Analytics

</h2>




<div class="table-card">


<Doughnut

:key="feedbackChart.datasets[0].data.join('-')"

:data="feedbackChart"

/>



</div>






<!-- =====================
UPCOMING APPOINTMENTS
===================== -->


<h2 class="section-title">

📅 Upcoming Appointments

</h2>



<div class="table-card">



<table class="appointments-table">



<tr>

<th>
Patient
</th>


<th>
Problem
</th>


<th>
Date
</th>


<th>
Time
</th>


<th>
Status
</th>


</tr>




<tr
v-for="item in upcomingAppointments"
:key="item._id"
>



<td>

{{item.patient?.user?.name || "N/A"}}

</td>




<td>

{{item.patient?.DescribeYourProblem || "N/A"}}

</td>





<td>

{{
new Date(item.appointmentDateTime)
.toLocaleDateString()
}}

</td>





<td>

{{
new Date(item.appointmentDateTime)
.toLocaleTimeString([],{
hour:"2-digit",
minute:"2-digit"
})
}}

</td>





<td>

<span class="status">

{{item.status}}

</span>

</td>



</tr>



</table>




<p v-if="!upcomingAppointments.length">

No upcoming appointments.

</p>



</div>



</div>


</template>


<style scoped>

.dashboard-page {
  min-height: 100%;
}

.page-title {
  font-size: 32px;
  color: var(--text);
  margin-bottom: 30px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.stat-card {
  background: var(--white);
  padding: 25px;
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: .3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  color: var(--muted);
  font-size: 16px;
}

.stat-card h1 {
  color: var(--primary);
  font-size: 38px;
  margin-top: 15px;
}

.section-title {
  grid-column: 1 / -1;
  margin-top: 30px;
  color: var(--text);
}

.table-card {
  grid-column: 1 / -1;
  background: var(--white);
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  overflow-x: auto;
}

.appointments-table {
  width: 100%;
  border-collapse: collapse;
}

.appointments-table th {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  padding: 15px;
  text-align: left;
}

.appointments-table td {
  padding: 15px;
  color: var(--text);
  border-bottom: 1px solid var(--border);
}

.appointments-table tr:hover {
  background: #f8fafc;
}

.status {
  padding: 8px 14px;
  border-radius: 20px;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
  font-weight: 700;
  font-size: 13px;
  text-transform: capitalize;
}

@media (max-width: 1000px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .cards {
    grid-template-columns: 1fr;
  }
}

</style>