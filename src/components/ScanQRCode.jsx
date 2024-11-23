import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const ScanQRCode = () => {
  const [result, setResult] = useState(''); // Menyimpan hasil scan
  const [scanning, setScanning] = useState(true); // Menentukan apakah kamera sedang aktif
  const [camera, setCamera] = useState('environment'); // Default kamera belakang

  // Fungsi untuk menangani hasil scan
  const handleScan = (data) => {
    if (data) {
      setResult(data.text); // Simpan hasil QR Code ke state
      setScanning(false); // Hentikan kamera setelah scan berhasil
    }
  };

  // Fungsi untuk menangani error saat scanning
  const handleError = (err) => {
    console.error('Camera Error:', err);
  };

  // Fungsi untuk menukar kamera
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
            onScan={handleScan}
            onError={handleError}
            onResult={(result, error) => {
                if (!!result) {
                    handleScan(result);
                }
      
                if (!!error) {
                    handleError(error);
                }
              }}
            constraints={{
              video: {
                facingMode: camera, // Default kamera belakang
              },
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
              setScanning(true); // Aktifkan kamera kembali
              setResult(''); // Reset hasil scan
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
