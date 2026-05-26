import axios from "axios";
import {BACKEND_URL} from '../../src/Constants/Servers/index'

const instance = axios.create({
    baseURL: BACKEND_URL,
})

// instance.interceptors.response.use((response)=>response,(err)=>{
//     if(err.response.status==400 && err.response.data.tokenErr) return window.location.href='/auth/login'
//     else return err
// })

export default instance