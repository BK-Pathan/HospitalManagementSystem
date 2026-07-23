<script setup>

import {ref,onMounted} from "vue";
import axios from "axios";


const rooms = ref([]);

const beds = ref([]);


const bed = ref({

bedNumber:"",
room:""

});



// Get Rooms

const getRooms = async()=>{

try{

const res = await axios.get(
"http://localhost:3000/api/rooms"
);


rooms.value=res.data;


}
catch(error){

console.log(error);

}

};



// Get Beds

const getBeds = async()=>{

try{


const res = await axios.get(
"http://localhost:3000/api/beds"
);


beds.value=res.data;


}
catch(error){

console.log(error);

}

};




// Add Bed

const addBed = async()=>{


try{


await axios.post(

"http://localhost:3000/api/beds",

bed.value

);



alert("Bed Added");



bed.value={

bedNumber:"",
room:""

};



getBeds();


}
catch(error){

console.log(error);

}


};



onMounted(()=>{

getRooms();

getBeds();

});


</script>





<template>


<div class="container">


<h2>
🛏 Bed Management
</h2>



<div class="form">


<input

v-model="bed.bedNumber"

placeholder="Bed Number"

/>



<select v-model="bed.room">


<option value="">

Select Room

</option>



<option

v-for="room in rooms"

:key="room._id"

:value="room._id"

>

Room {{room.roomNumber}}

-
{{room.type}}


</option>


</select>




<button @click="addBed">

Add Bed

</button>



</div>




<hr>



<h3>
All Beds
</h3>




<table>


<thead>

<tr>

<th>
Bed
</th>


<th>
Room
</th>


<th>
Status
</th>


</tr>

</thead>




<tbody>


<tr

v-for="b in beds"

:key="b._id"

>


<td>

{{b.bedNumber}}

</td>


<td>

Room {{b.room.roomNumber}}

</td>



<td>

<span>

{{b.status}}

</span>

</td>



</tr>


</tbody>


</table>


</div>


</template>