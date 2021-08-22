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

socket.on('qr-refreshed', (qrText) => {
    $('#qr-spinner').show();
    generateQr(qrText);
    $('#qr-spinner').hide();
});

function requestQr() {
    socket.emit("request-qr", deviceId, (response) => {
        console.log(response);
        if (response.success) {
            generateQr(response.qrText);
            $('#qr-spinner').hide();
        }
    });
}
$("#btn-refresh-qr").on("click", () => {
    $('#qr-spinner').show();
    requestQr();
});
requestQr();



