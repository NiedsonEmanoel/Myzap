import axios from 'axios';

let port = window.location.port;

if ((window.location.protocol == 'https:') && (port == '')) {
    port = '443'
}

if ((window.location.protocol == 'http:') && (port == '')) {
    port = '80'
}

let proxy = `${window.location.protocol}//${window.location.hostname}:${port}`

const api = axios.create({
    baseURL: proxy
});

export default api;