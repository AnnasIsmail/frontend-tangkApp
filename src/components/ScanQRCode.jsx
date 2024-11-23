import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';  // Import QR scanner
import QrReader from 'react-qr-scanner';  // Import QR scanner

const ScanQRCode = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true); // Menyimpan status scanning

  const handleScan = (data) => {
    if (data) {
      setResult(data.text); // Set hasil QR Code
      setScanning(false); // Hentikan scanning setelah berhasil
    }
  };

  const handleError = (err) => {
    console.error(err); // Menangani error jika ada
  };

  return (
    <div>
      <h1>Scan QR Code</h1>
      {scanning ? (
        <>
        <QrScanner
delay={300}
constraints={{
    facingMode: 'environment'
}}
style={{ width: '100%' }}
onError={handleError}
onScan={handleScan}
/>
        <QrScanner
        delay={300}
        style={{ width: '100%' }}
        onScan={handleScan}
        onError={handleError}
        facingMode="environment" // Menggunakan kamera belakang
      />
        <QrReader
        constraints={{
          facingMode: "environment",
        }}
        key="environment"
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }
        }}
        style={{
           width: "100%"}}
      />
        </>
      ) : (
        <div>
          <h2>Scan Berhasil!</h2>
          <p>Hasil QR: {result}</p>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;
