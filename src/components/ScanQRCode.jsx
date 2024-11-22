import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { useQRCodeScanner } from 'react-qr-scanner';

const ScanQRCode = () => {
  const [result, setResult] = useState('');
  const webcamRef = React.useRef(null);

  const handleScan = (data) => {
    if (data) {
      setResult(data.text); // Set hasil QR Code
    }
  };

  const handleError = (err) => {
    console.error(err); // Menangani error jika ada
  };

  return (
    <div>
      <h1>Scan QR Code</h1>
      <Webcam 
        audio={false} 
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: 'environment',  // Memilih kamera belakang
        }}
      />
      <p>Hasil QR: {result}</p>
    </div>
  );
};

export default ScanQRCode;
