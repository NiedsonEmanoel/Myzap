import openSocket from 'socket.io-client';
import pack from '../../package.json'

const socket = openSocket(pack.proxy)

export default socket;
