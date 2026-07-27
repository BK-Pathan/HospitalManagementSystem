<script setup>

import { ref, reactive, onMounted } from "vue";
import api from "../../api/axios";

import { Bar, Doughnut, Line } from "vue-chartjs";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    BarController,
    DoughnutController,
    LineController,
    Filler
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    BarController,
    DoughnutController,
    LineController,
    Filler
);

const doctorStatus = ref([]);

const todaysAppointments = ref([]);
const stats = ref({
    users:0,
    doctors:0,
    patients:0,
    appointments:0
});

// har chart ka apna alag loaded flag - taake ek dusre ko block na kare
const dataLoaded = ref(false);
const doctorLoaded = ref(false);

// ===== Appointment Status -> Doughnut =====
const chartData = reactive({
    labels:["Pending","Confirmed","Completed","Cancelled"],
    datasets:[
        {
            label:"Appointment Status",
            data:[0,0,0,0],
            backgroundColor:["#f59e0b","#2563eb","#16a34a","#dc2626"],
            borderWidth:0,
            hoverOffset:8
        }
    ]
});

const chartOptionsDoughnut = {
    responsive:true,
    maintainAspectRatio:false,
    cutout:"68%",
    plugins:{
        legend:{
            position:"bottom",
            labels:{
                usePointStyle:true,
                boxWidth:8,
                padding:18,
                font:{ size:12, weight:600 }
            }
        }
    }
};

// ===== Monthly Appointments -> Line =====
const monthChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"Appointments Per Month",
            data:[],
            borderColor:"#16a34a",
            backgroundColor:"rgba(22,163,74,0.12)",
            fill:true,
            tension:0.4,
            pointBackgroundColor:"#16a34a",
            pointBorderColor:"#ffffff",
            pointBorderWidth:2,
            pointRadius:5,
            pointHoverRadius:7
        }
    ]
});

const chartOptionsLine = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
        y:{ beginAtZero:true, grid:{ color:"#eef2f7" }, ticks:{ precision:0 } },
        x:{ grid:{ display:false } }
    }
};

// ===== Daily New Patients -> Bar =====
const patientChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"New Patients Per Day",
            data:[],
            backgroundColor:"#0891b2",
            borderRadius:8,
            maxBarThickness:34
        }
    ]
});

const chartOptionsBar = {
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
        y:{ beginAtZero:true, grid:{ color:"#eef2f7" }, ticks:{ precision:0 } },
        x:{ grid:{ display:false } }
    }
};

// ===== Doctor Performance -> Horizontal Bar =====
const doctorChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"Average Rating",
            data:[],
            backgroundColor:"#7c3aed",
            borderRadius:8,
            maxBarThickness:22
        }
    ]
});

const chartOptionsDoctor = {
    indexAxis:"y",
    responsive:true,
    maintainAspectRatio:false,
    plugins:{ legend:{ display:false } },
    scales:{
        x:{ beginAtZero:true, suggestedMax:5, grid:{ color:"#eef2f7" } },
        y:{ grid:{ display:false } }
    }
};

const getStats = async()=>{

    try{

        const res = await api.get("/admin/dashboard");

        stats.value = res.data;
        todaysAppointments.value = res.data.todaysAppointments || [];

        // =====================
        // Appointment Status
        // =====================

        const status = {
            Pending:0,
            Confirmed:0,
            Completed:0,
            Cancelled:0
        };

        res.data.appointmentStatus.forEach(item=>{
            const key = item._id.charAt(0).toUpperCase() + item._id.slice(1);
            status[key] = item.total;
        });

        chartData.datasets = [
            {
                label:"Appointment Status",
                data:[
                    status.Pending,
                    status.Confirmed,
                    status.Completed,
                    status.Cancelled
                ],
                backgroundColor:["#f59e0b","#2563eb","#16a34a","#dc2626"],
                borderWidth:0,
                hoverOffset:8
            }
        ];

        // =====================
        // Monthly Appointments
        // =====================

        monthChartData.labels = res.data.monthlyAppointments.map(
            item => `Month ${item._id.month}`
        );

        monthChartData.datasets = [
            {
                label:"Appointments Per Month",
                data: res.data.monthlyAppointments.map(item => item.total),
                borderColor:"#16a34a",
                backgroundColor:"rgba(22,163,74,0.12)",
                fill:true,
                tension:0.4,
                pointBackgroundColor:"#16a34a",
                pointBorderColor:"#ffffff",
                pointBorderWidth:2,
                pointRadius:5,
                pointHoverRadius:7
            }
        ];

        // =====================
        // Daily New Patients
        // =====================

        const dailyPatients = res.data.dailyPatients || [];

        patientChartData.labels = dailyPatients.map(item=>{
            return `${item._id.day}/${item._id.month}/${item._id.year}`;
        });

        patientChartData.datasets = [
            {
                label:"New Patients Per Day",
                data: dailyPatients.map(item => item.total),
                backgroundColor:"#0891b2",
                borderRadius:8,
                maxBarThickness:34
            }
        ];

        dataLoaded.value = true;

    }

    catch(error){
        console.log(error);
    }


    // =====================
    // Doctor Performance
    // =====================

    try{

        const performanceRes = await api.get("/admin/doctor-performance");

        doctorChartData.labels = performanceRes.data.map(
            item => item.doctorName
        );

        doctorChartData.datasets = [
            {
                label:"Average Rating",
                data: performanceRes.data.map(item => item.averageRating),
                backgroundColor:"#7c3aed",
                borderRadius:8,
                maxBarThickness:22
            }
        ];

        doctorLoaded.value = true;

    }

    catch(error){
        console.log("Doctor performance error:", error);
    }

    // =====================
    // Doctor Availability
    // =====================

    try{

        const doctorStatusRes = await api.get("/admin/doctor-status");

        doctorStatus.value = doctorStatusRes.data;

    }catch(error){

        console.log("Doctor status error:", error);

    }

};


onMounted(()=>{
    getStats();
});

</script>


<template>

<div class="dashboard">

    <div class="header">
        <div>
            <span class="eyebrow">Hospital Control Center</span>
            <h1>Admin Dashboard</h1>
            <p>Manage hospital operations, users and appointments</p>
        </div>
        <div class="badge">🏥 Admin</div>
    </div>

    <!-- ================= KPI ROW ================= -->

    <div class="kpi-row">

        <div class="card">
            <div class="icon icon-blue">👥</div>
            <div>
                <h3>Total Users</h3>
                <h1>{{stats.users}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon icon-purple">👨‍⚕️</div>
            <div>
                <h3>Total Doctors</h3>
                <h1>{{stats.doctors}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon icon-teal">🧑‍🤝‍🧑</div>
            <div>
                <h3>Total Patients</h3>
                <h1>{{stats.patients}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon icon-green">📅</div>
            <div>
                <h3>Total Appointments</h3>
                <h1>{{stats.appointments}}</h1>
            </div>
        </div>

    </div>

    <!-- ================= TODAY'S APPOINTMENTS ================= -->

    <div class="panel panel-full">

        <div class="panel-head">
            <h2>📅 Today's Appointments</h2>
            <span class="count-pill">{{ todaysAppointments.length }} today</span>
        </div>

        <table v-if="todaysAppointments.length">

            <thead>
                <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Time</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>

                <tr
                v-for="appointment in todaysAppointments"
                :key="appointment._id"
                >

                    <td>{{appointment.patient?.user?.name}}</td>

                    <td>{{ appointment.doctor?.name }}</td>

                    <td>
                        {{
                        new Date(appointment.appointmentDateTime)
                        .toLocaleTimeString([],{
                        hour:"2-digit",
                        minute:"2-digit"
                        })
                        }}
                    </td>

                    <td>
                        <span
                        class="status-tag"
                        :class="'status-' + appointment.status?.toLowerCase()"
                        >
                            {{ appointment.status }}
                        </span>
                    </td>

                </tr>

            </tbody>

        </table>

        <p v-else class="empty-state">No appointments today.</p>

    </div>

    <!-- ================= CHARTS GRID ================= -->

    <div class="charts-grid">

        <!-- Status Chart -->
        <div class="panel">
            <div class="panel-head">
                <h2>Appointment Status</h2>
                <span class="chart-tag">Distribution</span>
            </div>
            <div class="chart-wrapper chart-wrapper-donut">
                <Doughnut
                    v-if="dataLoaded"
                    :key="'status-'+dataLoaded"
                    :data="chartData"
                    :options="chartOptionsDoughnut"
                />
            </div>
        </div>

        <!-- Monthly Chart -->
        <div class="panel">
            <div class="panel-head">
                <h2>Monthly Appointments</h2>
                <span class="chart-tag">Trend</span>
            </div>
            <div class="chart-wrapper">
                <Line
                    v-if="dataLoaded"
                    :key="'month-'+dataLoaded"
                    :data="monthChartData"
                    :options="chartOptionsLine"
                />
            </div>
        </div>

        <!-- Daily Patients Chart -->
        <div class="panel">
            <div class="panel-head">
                <h2>Daily New Patients</h2>
                <span class="chart-tag">Growth</span>
            </div>
            <div class="chart-wrapper">
                <Bar
                    v-if="dataLoaded"
                    :key="'patient-'+dataLoaded"
                    :data="patientChartData"
                    :options="chartOptionsBar"
                />
            </div>
        </div>

        <!-- Doctor Performance Chart -->
        <div class="panel">
            <div class="panel-head">
                <h2>Doctor Performance</h2>
                <span class="chart-tag">Rating</span>
            </div>
            <div class="chart-wrapper">
                <Bar
                    v-if="doctorLoaded"
                    :key="'doctor-'+doctorLoaded"
                    :data="doctorChartData"
                    :options="chartOptionsDoctor"
                />
            </div>
        </div>

    </div>

    <!-- ================= DOCTOR AVAILABILITY ================= -->

    <div class="panel panel-full">

        <div class="panel-head">
            <h2>Doctor Availability Today</h2>
            <span class="count-pill">{{ doctorStatus.length }} doctors</span>
        </div>

        <div class="doctor-status">

            <div
            v-for="doctor in doctorStatus"
            :key="doctor.name"
            class="doctor-item"
            >

                <div class="doctor-item-top">

                    <div class="avatar">
                        {{ doctor.name?.charAt(0) }}
                    </div>

                    <div>
                        <h3>{{doctor.name}}</h3>
                        <p class="speciality">{{doctor.department}}</p>
                    </div>

                    <p
                    class="status-dot"
                    :class="doctor.available ? 'available':'not-available'"
                    >
                        {{doctor.available ? '🟢 Available' : '🔴 Unavailable'}}
                    </p>

                </div>

                <p class="speciality speciality-sub">
                    Speciality: {{doctor.specialties?.join(", ")}}
                </p>

                <p class="rating">
                    ⭐ {{doctor.averageRating || 0}} / 5
                    <span>({{doctor.totalReviews || 0}} Reviews)</span>
                </p>

            </div>

        </div>

    </div>

</div>

</template>

<style scoped>

* { box-sizing:border-box; }

.dashboard{
    min-height:100%;
    padding:28px;
    background:#f1f5f9;
}

/* ================= HEADER ================= */

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:28px;
}

.eyebrow{
    text-transform:uppercase;
    letter-spacing:1.5px;
    font-size:12px;
    font-weight:700;
    color:#2563eb;
}

.header h1{
    font-size:32px;
    font-weight:800;
    color:#0f172a;
    margin-top:6px;
}

.header p{
    color:#64748b;
    margin-top:6px;
    font-size:14px;
}

.badge{
    padding:12px 22px;
    border-radius:30px;
    background:linear-gradient(135deg,#2563eb,#06b6d4);
    color:white;
    font-weight:700;
    box-shadow:0 15px 35px rgba(37,99,235,.35);
}

/* ================= KPI CARDS ================= */

.kpi-row{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
    margin-bottom:24px;
}

.card{
    position:relative;
    overflow:hidden;
    background:rgba(255,255,255,.85);
    backdrop-filter:blur(15px);
    border:1px solid rgba(255,255,255,.6);
    border-radius:20px;
    padding:22px;
    display:flex;
    align-items:center;
    gap:18px;
    box-shadow:0 15px 40px rgba(15,23,42,.06);
    transition:.35s;
}

.card::before{
    content:"";
    position:absolute;
    width:110px;
    height:110px;
    right:-40px;
    top:-40px;
    background:radial-gradient(circle,rgba(37,99,235,.18),transparent);
}

.card:hover{
    transform:translateY(-6px);
    box-shadow:0 25px 60px rgba(37,99,235,.14);
}

.icon{
    width:58px;
    height:58px;
    flex-shrink:0;
    border-radius:16px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:28px;
}

.icon-blue{ background:linear-gradient(135deg,#dbeafe,#bfdbfe); }
.icon-purple{ background:linear-gradient(135deg,#ede9fe,#ddd6fe); }
.icon-teal{ background:linear-gradient(135deg,#cffafe,#a5f3fc); }
.icon-green{ background:linear-gradient(135deg,#dcfce7,#bbf7d0); }

.card h3{
    color:#64748b;
    font-size:13px;
    font-weight:600;
}

.card h1{
    margin-top:4px;
    font-size:30px;
    color:#0f172a;
}

/* ================= PANELS ================= */

.panel{
    background:rgba(255,255,255,.9);
    backdrop-filter:blur(18px);
    border-radius:22px;
    padding:26px;
    border:1px solid rgba(255,255,255,.7);
    box-shadow:0 15px 45px rgba(15,23,42,.06);
}

.panel-full{
    margin-bottom:24px;
}

.panel-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:20px;
}

.panel-head h2{
    font-size:18px;
    font-weight:700;
    color:#0f172a;
}

.count-pill{
    background:#eff6ff;
    color:#2563eb;
    font-size:12px;
    font-weight:700;
    padding:6px 14px;
    border-radius:20px;
}

.chart-tag{
    background:#f1f5f9;
    color:#64748b;
    font-size:11px;
    font-weight:700;
    text-transform:uppercase;
    letter-spacing:.5px;
    padding:5px 12px;
    border-radius:20px;
}

/* ================= CHARTS GRID ================= */

.charts-grid{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:24px;
    margin-bottom:24px;
}

.chart-wrapper{
    height:300px;
}

.chart-wrapper-donut{
    height:300px;
    max-width:340px;
    margin:0 auto;
}

/* ================= TABLE ================= */

.panel table{
    width:100%;
    border-collapse:separate;
    border-spacing:0 10px;
}

.panel th{
    background:#0f172a;
    color:white;
    padding:14px 15px;
    font-size:12px;
    text-transform:uppercase;
    letter-spacing:.5px;
    text-align:left;
}

.panel th:first-child{ border-radius:12px 0 0 12px; }
.panel th:last-child{ border-radius:0 12px 12px 0; }

.panel td{
    background:#f8fafc;
    padding:14px 15px;
    color:#334155;
    font-size:14px;
}

.panel tbody tr{ transition:.25s; }
.panel tbody tr:hover td{ background:#eff6ff; }

.status-tag{
    display:inline-block;
    padding:4px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:700;
    text-transform:capitalize;
}

.status-pending{ background:#fef3c7; color:#b45309; }
.status-confirmed{ background:#dbeafe; color:#1d4ed8; }
.status-completed{ background:#dcfce7; color:#15803d; }
.status-cancelled{ background:#fee2e2; color:#b91c1c; }

.empty-state{
    text-align:center;
    color:#94a3b8;
    padding:30px 0;
    font-size:14px;
}

/* ================= DOCTOR STATUS ================= */

.doctor-status{
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:18px;
}

.doctor-item{
    background:#f8fafc;
    border-radius:18px;
    padding:20px;
    border:1px solid #e2e8f0;
    transition:.3s;
}

.doctor-item:hover{
    transform:translateY(-4px);
    box-shadow:0 12px 30px rgba(0,0,0,.06);
}

.doctor-item-top{
    display:flex;
    align-items:center;
    gap:14px;
}

.avatar{
    width:44px;
    height:44px;
    flex-shrink:0;
    border-radius:14px;
    background:linear-gradient(135deg,#2563eb,#06b6d4);
    color:white;
    font-weight:700;
    display:flex;
    align-items:center;
    justify-content:center;
}

.doctor-item-top h3{
    color:#0f172a;
    font-size:15px;
}

.speciality{
    color:#64748b;
    font-size:13px;
    margin-top:2px;
}

.speciality-sub{
    margin-top:12px;
}

.status-dot{
    margin-left:auto;
    font-size:12px;
    font-weight:700;
    white-space:nowrap;
}

.available{ color:#16a34a; }
.not-available{ color:#dc2626; }

.rating{
    color:#f59e0b;
    font-weight:700;
    margin-top:10px;
    font-size:13px;
}

.rating span{
    color:#64748b;
    font-size:12px;
    font-weight:500;
}

/* ================= RESPONSIVE ================= */

@media(max-width:1100px){
    .kpi-row{ grid-template-columns:repeat(2,1fr); }
    .charts-grid{ grid-template-columns:1fr; }
}

@media(max-width:700px){
    .kpi-row{ grid-template-columns:1fr; }
    .doctor-status{ grid-template-columns:1fr; }
    .header{ flex-direction:column; align-items:flex-start; gap:15px; }
}

</style>