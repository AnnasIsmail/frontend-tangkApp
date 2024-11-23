import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const ScanQRCode = () => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true);
  const [camera, setCamera] = useState('environment'); // Default kamera belakang

  const handleScan = (data) => {
    if (data) {
      setResult(data.text); // Set hasil QR Code
      setScanning(false); // Hentikan scanning
    }
  };

  const handleError = (err) => {
    console.error(err); // Menangani error jika ada
  };

  const toggleCamera = () => {
    // Menukar kamera antara depan dan belakang
    setCamera((prevCamera) => (prevCamera === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div>
      <h1>Scan QR Code</h1>
      {scanning ? (
        <div>
          <QrScanner
            delay={300}
            style={{ width: '100%' }}
            onScan={handleScan}
            onError={handleError}
            facingMode={camera} // Mengatur mode kamera
          />
          <button onClick={toggleCamera} style={{ marginTop: '10px' }}>
            {camera === 'environment' ? 'Gunakan Kamera Depan' : 'Gunakan Kamera Belakang'}
          </button>
        </div>
      ) : (
        <div>
          <h2>Scan Berhasil!</h2>
          <p>Hasil QR: {result}</p>
          <button onClick={() => setScanning(true)}>Scan Ulang</button>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;
