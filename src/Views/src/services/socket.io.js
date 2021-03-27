import openSocket from 'socket.io-client/dist/socket.io';

let port = window.location.port;

if ((window.location.protocol == 'https:') && (port == '')) {
    port = '443'
}

if ((window.location.protocol == 'http:') && (port == '')) {
    port = '80'
}

let proxy = `${window.location.protocol}//${window.location.hostname}:${port}`

const socket = openSocket(proxy)
export default socket;
