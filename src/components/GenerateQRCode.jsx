import React, { useState } from 'react';
import QRCode from 'react-qr-code'; // Default import

const GenerateQRCode = () => {
  const [text, setText] = useState('https://example.com/67404f6f92507439fe9df6bc'); // Data yang ingin dikodekan

  return (
    <div>
      <h1>Generate QR Code</h1>
      <QRCode value={text} size={256} />
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text to generate QR Code"
        style={{ marginTop: '20px', padding: '10px', width: '80%' }}
      />
    </div>
  );
};

export default GenerateQRCode;
