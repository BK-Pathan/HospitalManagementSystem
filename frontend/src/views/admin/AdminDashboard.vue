<script setup>

import { ref, reactive, onMounted } from "vue";
import api from "../../api/axios";

import { Bar } from "vue-chartjs";

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    BarController
} from "chart.js";

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    BarController
);

const stats = ref({
    users:0,
    doctors:0,
    patients:0,
    appointments:0
});

// har chart ka apna alag loaded flag - taake ek dusre ko block na kare
const dataLoaded = ref(false);
const doctorLoaded = ref(false);

const chartData = reactive({
    labels:["Pending","Confirmed","Completed","Cancelled"],
    datasets:[
        {
            label:"Appointment Status",
            data:[0,0,0,0],
            backgroundColor:"#2563eb"
        }
    ]
});

const monthChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"Appointments Per Month",
            data:[],
            backgroundColor:"#16a34a"
        }
    ]
});

const patientChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"New Patients Per Day",
            data:[],
            backgroundColor:"#dc2626"
        }
    ]
});

const doctorChartData = reactive({
    labels:[],
    datasets:[
        {
            label:"Doctor Rating",
            data:[],
            backgroundColor:"#7c3aed"
        }
    ]
});

const chartOptions = {
    responsive:true,
    maintainAspectRatio:false
};

const getStats = async()=>{

    try{

        const res = await api.get("/admin/dashboard");

        console.log("Dashboard Data:", res.data);

        stats.value = res.data;

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
                backgroundColor:"#2563eb"
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
                backgroundColor:"#16a34a"
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
                backgroundColor:"#dc2626"
            }
        ];

        console.log("chartData final:", JSON.stringify(chartData));
        console.log("monthChartData final:", JSON.stringify(monthChartData));

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
                backgroundColor:"#7c3aed"
            }
        ];

        console.log("doctorChartData final:", JSON.stringify(doctorChartData));

        // alag flag - isi chart ko force remount karwayega
        doctorLoaded.value = true;

    }

    catch(error){
        console.log("Doctor performance error:", error);
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
            <h1>Admin Dashboard</h1>
            <p>Manage hospital operations, users and appointments</p>
        </div>
        <div class="badge">🏥 Admin</div>
    </div>

    <div class="cards">

        <div class="card">
            <div class="icon">👥</div>
            <div>
                <h3>Total Users</h3>
                <h1>{{stats.users}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon">👨‍⚕️</div>
            <div>
                <h3>Total Doctors</h3>
                <h1>{{stats.doctors}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon">🧑‍🤝‍🧑</div>
            <div>
                <h3>Total Patients</h3>
                <h1>{{stats.patients}}</h1>
            </div>
        </div>

        <div class="card">
            <div class="icon">📅</div>
            <div>
                <h3>Total Appointments</h3>
                <h1>{{stats.appointments}}</h1>
            </div>
        </div>

        <!-- Status Chart -->
        <div class="chart-card">
            <h2>Appointment Status</h2>
            <div class="chart-wrapper">
                <Bar
                    v-if="dataLoaded"
                    :key="'status-'+dataLoaded"
                    :data="chartData"
                    :options="chartOptions"
                />
            </div>
        </div>

        <!-- Monthly Chart -->
        <div class="chart-card">
            <h2>Monthly Appointments</h2>
            <div class="chart-wrapper">
                <Bar
                    v-if="dataLoaded"
                    :key="'month-'+dataLoaded"
                    :data="monthChartData"
                    :options="chartOptions"
                />
            </div>
        </div>

        <!-- Daily Patients Chart -->
        <div class="chart-card">
            <h2>Daily New Patients</h2>
            <div class="chart-wrapper">
                <Bar
                    v-if="dataLoaded"
                    :key="'patient-'+dataLoaded"
                    :data="patientChartData"
                    :options="chartOptions"
                />
            </div>
        </div>

        <!-- Doctor Performance Chart -->
        <div class="chart-card">
            <h2>Doctor Performance</h2>
            <div class="chart-wrapper">
                <Bar
                    v-if="doctorLoaded"
                    :key="'doctor-'+doctorLoaded"
                    :data="doctorChartData"
                    :options="chartOptions"
                />
            </div>
        </div>

    </div>

</div>

</template>

<style scoped>

.dashboard{ min-height:100%; }

.header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:35px;
}

.header h1{ color:var(--text); font-size:32px; font-weight:700; }
.header p{ color:var(--muted); margin-top:8px; }

.badge{
    padding:12px 20px;
    border-radius:30px;
    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:white;
    font-weight:600;
}

.cards{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:25px;
}

.card{
    background:var(--white);
    border:1px solid var(--border);
    border-radius:20px;
    padding:25px;
    display:flex;
    align-items:center;
    gap:20px;
    box-shadow:var(--shadow);
    transition:.3s;
}

.card:hover{ transform:translateY(-6px); }

.icon{
    width:60px;
    height:60px;
    border-radius:18px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:30px;
    background:rgba(20,184,166,.15);
}

.card h3{ color:var(--muted); font-size:15px; font-weight:600; margin-bottom:8px; }
.card h1{ color:var(--primary); font-size:32px; margin:0; }

@media(max-width:1100px){
    .cards{ grid-template-columns:repeat(2,1fr); }
}

@media(max-width:600px){
    .header{ flex-direction:column; align-items:flex-start; gap:15px; }
    .cards{ grid-template-columns:1fr; }
}

.chart-card{
    grid-column:span 4;
    background:var(--white);
    padding:30px;
    border-radius:20px;
    box-shadow:var(--shadow);
}

.chart-card h2{ margin-bottom:25px; color:var(--text); }

.chart-wrapper{
    position:relative;
    height:350px;
    width:100%;
}

</style>