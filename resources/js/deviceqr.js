import '../styles/_deviceqr.scss';

import io from 'socket.io-client';
import $ from 'jquery';

import QRCode from 'qrcode';

const socket = io();
// socket.on('refresh-qr', (data) => {

// });

function requestQr() {
    socket.emit("request-qr", (response) => {
        let opts = {
            errorCorrectionLevel: 'H',
            type: 'image/jpeg',
            width: '300'
        };
        let text = '1@T3yaMex96CQ2qVbuqlFClwTx7IzGQOsSLhdUjehNGQHgdWqVktCt3UMpa3j6Ry+aL3zE+Sfa+s1yGw==';
        QRCode.toCanvas(document.getElementById('qr-image'), text, opts, function (error) {
        })
        $('#qr-spinner').hide();
    });
}
$("#btn-refresh-qr").on("click", () => {
    $('#qr-spinner').show();
    setTimeout(() => {
        requestQr();
    }, 2000);
});

setTimeout(() => {
    requestQr();
}, 2000);


