import '../styles/_deviceqr.scss';

import io from 'socket.io-client';
import $ from 'jquery';

import QRCode from 'qrcode';

const socket = io({
    query: {
        deviceId: deviceId
    }
});

function generateQr(qrText) {
    let opts = {
        errorCorrectionLevel: 'H',
        type: 'image/jpeg',
        width: '300'
    };
    QRCode.toCanvas(document.getElementById('qr-image'), qrText, opts, function (error) {
    })
}

socket.on('session-changed', () => {
    window.location.reload();
});

socket.on('qr-refreshed', (responseQr) => {
    console.log("qr-refreshed", responseQr);

    $('#qr-spinner').show();
    if (responseQr.success) {
        generateQr(responseQr.qrText);
        $('#qr-spinner').hide();
    }
});

function requestQr() {
    socket.emit("request-qr", deviceId, (responseQr) => {
        console.log("request-qr", responseQr);
        if (responseQr.success) {
            generateQr(responseQr.qrText);
            $('#qr-spinner').hide();
        }
    });
}
$("#btn-refresh-qr").on("click", () => {
    $('#qr-spinner').show();
    requestQr();
});
requestQr();



