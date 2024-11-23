import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const ScanQRCode = ({ onScan }) => {
  const [result, setResult] = useState('');
  const [scanning, setScanning] = useState(true);
  const [camera, setCamera] = useState('environment');

  const handleScan = (data) => {
    if (data) {
      const scannedId = data.text;
      setResult(scannedId);
      setScanning(false);
      if (onScan) {
        onScan(scannedId); // Panggil fungsi callback saat scan berhasil
      }
    }
  };

  const handleError = (err) => {
    console.error('Camera Error:', err);
  };

  const toggleCamera = () => {
    setCamera((prevCamera) => (prevCamera === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>QR Code Scanner</h1>
      {scanning ? (
        <div>
          <QrScanner
            delay={300}
            style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}
            onResult={(result, error) => {
              if (result) handleScan(result);
              if (error) handleError(error);
            }}
            constraints={{
              video: { facingMode: camera },
            }}
          />
          <button onClick={toggleCamera} style={{ marginTop: '10px', padding: '10px 20px' }}>
            {camera === 'environment' ? 'Gunakan Kamera Depan' : 'Gunakan Kamera Belakang'}
          </button>
        </div>
      ) : (
        <div>
          <h2>Hasil QR Code:</h2>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>{result}</p>
          <button
            onClick={() => {
              setScanning(true);
              setResult('');
            }}
            style={{ marginTop: '10px', padding: '10px 20px' }}
          >
            Scan Ulang
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanQRCode;