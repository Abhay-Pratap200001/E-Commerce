import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:import.meta.mode === "development" ? "http://localhost:7000/api" : "/api",
    withCredentials:true, //help to send cookies in every single request
})


export default axiosInstance