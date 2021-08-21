import io from 'socket.io-client';
import $ from 'jquery';

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

