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
  <div class="appointments">

    <h2>My Patient Appointments</h2>

    <p v-if="loading">Loading...</p>

    <table v-else border="1" width="100%" cellspacing="0">
      <thead>
        <tr>
          <th>Patient</th>
          <th>Email</th>
          <th>Date</th>
          <th>Status</th>
          <th width="180">Action</th>
        </tr>
      </thead>

      <tbody>

        <tr v-if="appointments.length === 0">
          <td colspan="5" style="text-align:center">
            No appointments found
          </td>
        </tr>

        <tr
          v-for="item in appointments"
          :key="item._id"
        >
          <!-- Agar patient.user populate ho -->
          <td>{{ item.patient?.user?.name || item.patient?.name }}</td>

          <td>{{ item.patient?.user?.email || item.patient?.email }}</td>

         <td>
{{item.patient?.user?.name || "Unknown"}}
</td>


<td>
{{item.patient?.user?.email || "Unknown"}}
</td>

          <td>{{ item.status }}</td>

          <td>

            <button
              @click="updateStatus(item._id,'confirmed')"
              :disabled="item.status==='confirmed'"
            >
              Confirm
            </button>

            <button
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
</template>

<style scoped>
.appointments{
    padding:20px;
}

table{
    width:100%;
    border-collapse:collapse;
}

th,
td{
    padding:10px;
    text-align:center;
}

button{
    margin:3px;
    padding:6px 12px;
    cursor:pointer;
}
</style>