const QRCode = require('qrcode');


const ticketData = 'Hello, Event-Ticketing-Platform! This is a test.';


QRCode.toDataURL(ticketData, (err, url) => {
  if (err) {
    console.error('Error generating QR code', err);
    return;
  }

 
  console.log('Successfully generated QR Code Data URL:');
  console.log(url);
});