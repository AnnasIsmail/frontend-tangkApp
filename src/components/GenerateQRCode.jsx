import React, { useState } from 'react';
import QRCode from 'react-qr-code'; // Default import

const GenerateQRCode = () => {
  const [text, setText] = useState('67404f6f92507439fe9df6bc'); // Data yang ingin dikodekan

  return (
    <div>
      <h1>Generate QR Code</h1>
      <QRCode value={text} />
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text to generate QR Code"
      />
    </div>
  );
};

export default GenerateQRCode;
