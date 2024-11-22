import React from 'react';
import QrScanner from 'react-qr-scanner';

const ScanQRCode = () => {
  const handleScan = (data) => {
    if (data) {
      console.log("QR Code data:", data); // Menampilkan hasil QR Code yang dibaca
    }
  };

  const handleError = (err) => {
    console.error("Error:", err); // Menangani error kamera
  };

  return (
    <div>
      <h1>Scan QR Code</h1>
      <QrScanner
        delay={300} // Waktu delay pembacaan kamera
        style={{ width: '100%' }}
        onError={handleError}
        onScan={handleScan}
      />
    </div>
  );
};

export default ScanQRCode;
