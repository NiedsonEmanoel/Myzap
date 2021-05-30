import openSocket from 'socket.io-client/dist/socket.io';
import { getToken } from './auth'
let token = getToken();
let port = window.location.port;

if ((window.location.protocol == 'https:') && (port == '')) {
    port = '443'
}

if ((window.location.protocol == 'http:') && (port == '')) {
    port = '80'
}

let proxy = `${window.location.protocol}//${window.location.hostname}:${port}`

const socket = openSocket(proxy/*, {
    query: { token }
}*/)
export default socket;
