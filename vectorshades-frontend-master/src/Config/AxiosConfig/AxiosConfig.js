import axios from 'axios'
import {BACKEND_URL} from '../../Constants/Servers/index'
const instance = axios.create({
    baseURL:BACKEND_URL,
    headers:{"Authorization":`Bearer ${`thisisdummycontent`}`}
})

export default instance