import axios from "axios";
import router from "../router";


const api = axios.create({

    baseURL:"http://localhost:3000/",

    withCredentials:true

});



// Global Error Handler

api.interceptors.response.use(

    (response)=>{

        return response;

    },


    (error)=>{


        if(error.response?.status === 401){


            console.log(
                "Session expired"
            );


            localStorage.removeItem("user");

            localStorage.removeItem("role");


            router.push("/");


        }


        return Promise.reject(error);


    }

);



export default api;