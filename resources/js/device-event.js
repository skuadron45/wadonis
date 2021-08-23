import '../styles/_deviceqr.scss';

import io from 'socket.io-client';
import $ from 'jquery';

import formSer from "form-serialize";

import QRCode from 'qrcode';

const socket = io({
    query: {
        deviceId: DEVICE_ID
    }
});

socket.on('session-changed', () => {
    window.location.reload();
});

socket.on('chat-update', (user, chat) => {
    console.log(user, chat);
});

$("#main-form").on('submit', () => {
    return false;
})

$("#btn-send").on("click", () => {
    let form = $("#main-form")[0];
    let data = formSer(form, { hash: true });

    socket.emit("send-message", DEVICE_ID, data, (response) => {
        console.log(response);
    });
});

$("#btn-load-contact").on("click", () => {
    socket.emit("load-contact", DEVICE_ID, (response) => {

        for (let contact of response) {
            console.log(contact);
        }
    });
});



