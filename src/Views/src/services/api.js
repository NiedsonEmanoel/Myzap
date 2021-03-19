import axios from 'axios';
import pack from '../../package.json'

const api = axios.create({
    baseURL: pack.proxy
});

export default api;