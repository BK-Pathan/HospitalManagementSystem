<script setup>

import {ref,onMounted} from "vue";
import axios from "axios";


const rooms = ref([]);


const room = ref({

roomNumber:"",
type:"",
floor:"",
chargesPerDay:""

});



const getRooms = async()=>{

try{

const res = await axios.get(
"http://localhost:3000/api/rooms"
);


rooms.value=res.data;


}catch(error){

console.log(error);

}

}




const addRoom = async()=>{


try{


await axios.post(

"http://localhost:3000/api/rooms",

room.value

);


alert("Room Added");


room.value={

roomNumber:"",
type:"",
floor:"",
chargesPerDay:""

};


getRooms();


}
catch(error){

console.log(error);

}

}




onMounted(()=>{

getRooms();

});


</script>



<template>


<div class="container">


<h2>
🏥 Room Management
</h2>



<div class="form">


<input
v-model="room.roomNumber"
placeholder="Room Number"
/>


<select v-model="room.type">

<option value="">
Select Type
</option>

<option>
General
</option>

<option>
Private
</option>

<option>
Semi Private
</option>

<option>
ICU
</option>

<option>
Emergency
</option>


</select>



<input
v-model="room.floor"
placeholder="Floor"
/>



<input
v-model="room.chargesPerDay"
placeholder="Charges Per Day"
/>



<button @click="addRoom">
Add Room
</button>


</div>




<hr>



<h3>
All Rooms
</h3>



<table>


<thead>

<tr>

<th>
Room
</th>

<th>
Type
</th>

<th>
Floor
</th>

<th>
Status
</th>


</tr>

</thead>



<tbody>


<tr
v-for="r in rooms"
:key="r._id"
>


<td>
{{r.roomNumber}}
</td>


<td>
{{r.type}}
</td>


<td>
{{r.floor}}
</td>


<td>
{{r.status}}
</td>



</tr>


</tbody>


</table>



</div>



</template>