import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';  // Import QR scanner
import { useEffect } from 'react';

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

  const checkCameraDevices = () => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        console.log(videoDevices); // Menampilkan semua perangkat kamera
        // Lihat apakah ada kamera belakang
        const backCamera = videoDevices.find(device => device.label.includes('back'));
        console.log(backCamera);
      })
      .catch(error => console.error('Error accessing devices:', error));
  };
  
  useEffect(() => {
    checkCameraDevices();
  }, []);

  return (
    <div>
      <h1>Scan QR Code</h1>
      {scanning ? (
        <QrScanner
          delay={300}
          style={{ width: '100%' }}
          onScan={handleScan}
          onError={handleError}
          facingMode={{ exact: "environment" }}  // Pastikan menggunakan objek seperti ini
        />
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
