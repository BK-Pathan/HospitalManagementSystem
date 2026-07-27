<template>

<div class="water-container">

    <div class="water-mesh"></div>


    <div class="particles">

        <span style="left:5%;animation-duration:18s"></span>
        <span style="left:15%;animation-duration:22s"></span>
        <span style="left:28%;animation-duration:16s"></span>
        <span style="left:42%;animation-duration:25s"></span>
        <span style="left:58%;animation-duration:20s"></span>
        <span style="left:71%;animation-duration:17s"></span>
        <span style="left:82%;animation-duration:24s"></span>
        <span style="left:92%;animation-duration:19s"></span>

    </div>


</div>

</template>


<style scoped>


.water-container{

position:fixed;

inset:0;

overflow:hidden;

pointer-events:none;

z-index:0;

background:

linear-gradient(
180deg,
#fbfdff,
#f3f8ff,
#ffffff
);

}



/* PREMIUM WATER MESH */

.water-mesh{

position:absolute;

inset:0;


background:


radial-gradient(
circle at 15% 20%,
rgba(59,130,246,.35),
transparent 35%
),


radial-gradient(
circle at 85% 15%,
rgba(255,255,255,.9),
transparent 30%
),


radial-gradient(
circle at 70% 80%,
rgba(37,99,235,.25),
transparent 45%
),


radial-gradient(
circle at 30% 85%,
rgba(147,197,253,.35),
transparent 40%
),


linear-gradient(
120deg,
#ffffff,
#eaf4ff
);



background-size:

180% 180%;


animation:

waterMove 25s ease-in-out infinite;


filter:

blur(20px);


}




@keyframes waterMove{


0%{

background-position:

0% 0%;

}


50%{

background-position:

100% 80%;

}


100%{

background-position:

0% 0%;

}


}



/* FLOATING WATER PARTICLES */


.particles{

position:absolute;

inset:0;

}



.particles span{


position:absolute;


width:5px;

height:5px;


border-radius:50%;


background:white;


box-shadow:

0 0 15px white;


animation:

float linear infinite;


}



@keyframes float{


0%{

transform:

translateY(100vh);

opacity:0;

}



30%{

opacity:1;

}



100%{

transform:

translateY(-100px);

opacity:0;

}


}



@media(max-width:768px){


.particles{

display:none;

}


.water-mesh{

filter:blur(35px);

}


}



</style>