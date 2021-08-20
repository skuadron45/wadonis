import '../styles/_app.scss';

import $ from 'jquery';
window.$ = $;

import 'bootstrap';

import QRCode from "qrcode";
import io from "socket.io-client";

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

const socket = io();

socket.on('refresh-qr', (data) => {
    var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
    };
    QRCode.toDataURL(data.qr, opts, function (err, url) {
        var img = document.getElementById('qr-image')
        img.src = url
    })
});

function requestQr() {
    socket.emit("request-qr", (response) => {
        console.log(response);
    });
}

$("#btn-qr").on("click", () => {
    requestQr();
});

$("#button-add-device").on("click", () => {
    console.log("add");
});


requestQr();

