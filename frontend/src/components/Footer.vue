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

    margin-top:20px;

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

    box-sizing:border-box;

}



/* Right links */

.footer-right{

    display:flex;

    gap:20px;

    align-items:center;

}



.footer-right span{

    cursor:pointer;

    transition:.3s;

    white-space:nowrap;

}



.footer-right span:hover{

    color:var(--primary);

}



/* Tablet */

@media(max-width:900px){


    .footer{

        padding:16px 20px;

        font-size:12.5px;

    }


    .footer-right{

        gap:15px;

    }

}




/* Mobile */

@media(max-width:700px){


    .footer{

        flex-direction:column;

        justify-content:center;

        align-items:center;

        text-align:center;

        padding:18px 14px;

        gap:12px;

    }



    .footer-left{

        width:100%;

        line-height:1.5;

    }



    .footer-right{

        width:100%;

        display:flex;

        justify-content:center;

        flex-wrap:wrap;

        gap:10px 18px;

    }



    .footer-right span{

        font-size:12px;

    }

}



/* Small mobile */

@media(max-width:400px){


    .footer{

        padding:15px 10px;

    }



    .footer-left{

        font-size:11.5px;

    }



    .footer-right{

        gap:8px 14px;

    }



}

</style>