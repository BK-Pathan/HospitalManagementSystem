<template>

<footer class="footer">

    <div class="footer-left">

        © {{ year }} Hospital Management System

    </div>


    <div class="footer-right">

        <span>
            Privacy Policy
        </span>

        <span>
            Terms
        </span>

        <span>
            Version 1.0
        </span>

    </div>


</footer>

</template>



<script setup>

const year = new Date().getFullYear();

</script>



<style scoped>


.footer{

    width:100%;

    margin-top: 20px;

    padding:18px 25px;

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:15px;


    background:var(--surface);

    backdrop-filter:blur(12px);


    border-top:1px solid var(--border);


    color:var(--muted);

    font-size:13px;

    font-weight:600;


}



.footer-right{

    display:flex;

    gap:20px;

}



.footer-right span{

    cursor:pointer;

    transition:.3s;

}



.footer-right span:hover{

    color:var(--primary);

}




@media(max-width:700px){


.footer{

    flex-direction:column;

    text-align:center;

    padding:15px;

}



.footer-right{

    flex-wrap:wrap;

    justify-content:center;

    gap:12px;

}


}


</style>