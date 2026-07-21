<script setup>
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
ref,
onMounted
} from "vue";

import api from "../../api/axios";


const prescriptions = ref([]);

const loading = ref(true);



const getMyPrescriptions = async()=>{


try{


const res = await api.get(
"/prescription/my"
);

console.log(
"Prescription API:",
JSON.stringify(res.data,null,2)
);

console.log(
"My Prescriptions:",
res.data
);



prescriptions.value = res.data;



}
catch(error){


console.log(
"Prescription Error:",
error.response?.data || error.message
);


}
finally{

loading.value=false;

}


};

const downloadPDF = (item)=>{


const doc = new jsPDF();



doc.setFontSize(20);

doc.text(
"Medical Prescription",
20,
20
);




doc.setFontSize(12);



doc.text(
`Patient: ${item.patient?.user?.name || "N/A"}`,
20,
35
);



doc.text(
`Doctor: ${item.doctor?.user?.name || "N/A"}`,
20,
45
);



doc.text(
`Date: ${new Date(item.createdAt).toLocaleDateString()}`,
20,
55
);




doc.text(
"Medicines",
20,
70
);





autoTable(doc,{

startY:80,


head:[

[
"Medicine",
"Dosage",
"Frequency"
]

],


body:item.medicines.map(med=>[

med.name,

med.dosage || "-",

med.frequency || "-"

])


});





let finalY =
doc.lastAutoTable.finalY + 15;





doc.text(

"Instructions:",

20,

finalY

);



doc.text(

item.instructions || "No instructions",

20,

finalY+10

);






doc.text(

"Notes:",

20,

finalY+30

);



doc.text(

item.notes || "No notes",

20,

finalY+40

);






doc.save(

`Prescription-${item.patient?.user?.name || "Patient"}.pdf`

);



};
onMounted(()=>{

getMyPrescriptions();

});


</script>

<template>

<div class="page">


<h2 class="title">

📄 Prescription History

</h2>



<div v-if="loading">

Loading prescriptions...

</div>




<div

v-else-if="!prescriptions.length"

class="empty"

>

No Prescription Available

</div>






<div

v-for="item in prescriptions"

:key="item._id"

class="prescription-card"

>


<div class="header">


<div>

<h3>

👤 Patient:

{{ item.patient?.user?.name || "Patient" }}

</h3>


<h3>

👨‍⚕️ Doctor:

{{ item.doctor?.user?.name || "Doctor" }}

</h3>

</div>




<p>

📅

{{

new Date(item.createdAt)

.toLocaleDateString()

}}

</p>


</div>





<hr>





<h3>

💊 Medicines

</h3>




<table>


<thead>


<tr>

<th>
Medicine
</th>


<th>
Dosage
</th>


<th>
Frequency
</th>


</tr>


</thead>



<tbody>



<tr

v-for="med in item.medicines"

:key="med._id"

>


<td>

{{ med.name }}

</td>



<td>

{{ med.dosage || "-" }}

</td>



<td>

{{ med.frequency || "-" }}

</td>



</tr>



</tbody>



</table>





<div class="info">


<h4>

📝 Instructions

</h4>


<p>

{{ item.instructions || "No instructions" }}

</p>





<h4>

📌 Notes

</h4>


<p>

{{ item.notes || "No notes" }}

</p>



</div>


<button

class="download-btn"

@click="downloadPDF(item)"

>

⬇️ Download PDF

</button>


</div>




</div>


</template>



<style scoped>


.page{

padding:30px;

}



.title{

font-size:32px;

margin-bottom:30px;

color:var(--text);

}



.empty{

background:white;

padding:30px;

border-radius:20px;

text-align:center;

box-shadow:var(--shadow);

}




.prescription-card{


background:white;

padding:30px;

border-radius:25px;

margin-bottom:25px;

box-shadow:var(--shadow);

border:1px solid var(--border);


}



.header{


display:flex;

justify-content:space-between;

align-items:center;


}



.header h3{

color:var(--primary);

}





table{

width:100%;

border-collapse:collapse;

margin-top:20px;


}



th{


background:linear-gradient(
135deg,
var(--primary),
var(--primary-dark)
);


color:white;

padding:14px;

text-align:left;


}



td{


padding:14px;

border-bottom:1px solid #ddd;


}



.info{


margin-top:25px;

background:#f8fafc;

padding:20px;

border-radius:15px;


}



.info h4{


color:var(--primary);

margin-top:15px;


}
.download-btn{

margin-top:20px;

padding:12px 20px;

border:none;

border-radius:12px;

background:linear-gradient(
135deg,
#2563eb,
#0ea5e9
);

color:white;

font-weight:700;

cursor:pointer;

}


.download-btn:hover{

transform:translateY(-2px);

}

</style>