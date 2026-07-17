<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";

const appointments = ref([]);
const loading = ref(false);

const getAppointments = async () => {
  try {
    loading.value = true;

    const res = await api.get("/doctor/appointments");

    console.log("Appointments:", res.data);

    appointments.value = res.data;
  } catch (error) {
    console.error(error);
    appointments.value = [];
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (id, status) => {
  try {
    await api.put(`/doctor/appointment/${id}`, {
      status,
    });

    await getAppointments();
  } catch (error) {
    console.error(error);
    alert("Unable to update appointment status");
  }
};

onMounted(() => {
  getAppointments();
});
</script>

<template>
  <div class="appointments-page">


    <h2 class="page-title">
      My Patient Appointments
    </h2>


    <p v-if="loading" class="loading-text">
      Loading...
    </p>




    <div v-else class="table-card">


    <table class="appointments-table">


      <thead>

        <tr>

          <th>
            Patient
          </th>

          <th>
            Email
          </th>

          <th>
            Date
          </th>

          <th>
            Status
          </th>

          <th width="180">
            Action
          </th>

        </tr>

      </thead>





      <tbody>


        <tr v-if="appointments.length === 0">

          <td colspan="5" class="empty-data">

            No appointments found

          </td>

        </tr>





        <tr
          v-for="item in appointments"
          :key="item._id"
        >



          <td class="patient-name">
            {{ item.patient?.user?.name || item.patient?.name || 'Unknown' }}
          </td>




          <td>
            {{ item.patient?.user?.email || item.patient?.email || 'N/A' }}
          </td>




          <td>

            {{ item.appointmentDateTime ? new Date(item.appointmentDateTime).toLocaleString() : 'N/A' }}

          </td>




          <td>

            <span class="status">

              {{ item.status }}

            </span>

          </td>




          <td class="action-buttons">


            <button
              class="confirm-btn"
              @click="updateStatus(item._id,'confirmed')"
              :disabled="item.status==='confirmed'"
            >

              Confirm

            </button>




            <button
              class="complete-btn"
              @click="updateStatus(item._id,'completed')"
              :disabled="item.status==='completed'"
            >

              Complete

            </button>


          </td>



        </tr>



      </tbody>


    </table>


    </div>


  </div>
</template>

<style scoped>


.appointments-page{

    min-height:100%;

}




.page-title{

    color:var(--text);

    font-size:32px;

    margin-bottom:30px;

}




.loading-text{

    color:var(--muted);

    font-size:18px;

}





.table-card{

    background:var(--white);

    padding:30px;

    border-radius:22px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

    overflow-x:auto;

}





.appointments-table{

    width:100%;

    border-collapse:collapse;

}





.appointments-table th{

    padding:16px;

    text-align:left;

    color:white;

    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );

}





.appointments-table td{

    padding:16px;

    color:var(--text);

    border-bottom:1px solid var(--border);

}





.appointments-table tr:hover{

    background:#f8fafc;

}





.patient-name{

    font-weight:700;

    color:var(--primary);

}





.status{

    padding:8px 15px;

    border-radius:20px;

    background:rgba(20,184,166,.15);

    color:var(--primary);

    font-size:13px;

    font-weight:700;

    text-transform:capitalize;

}





.action-buttons{

    display:flex;

    gap:10px;

}





button{

    border:none;

    padding:10px 15px;

    border-radius:10px;

    cursor:pointer;

    color:white;

    font-weight:700;

    transition:.3s;

}





.confirm-btn{

    background:var(--primary);

}





.complete-btn{

    background:var(--secondary);

}





button:hover{

    transform:translateY(-2px);

}





button:disabled{

    opacity:.5;

    cursor:not-allowed;

    transform:none;

}





.empty-data{

    text-align:center;

    color:var(--muted);

    padding:30px;

}



</style>


