import openSocket from 'socket.io-client/dist/socket.io';
import pack from '../../package.json'

const socket = openSocket(pack.proxy)
export default socket;
