import QRCode from 'react-qr-code'; // Default import

const GenerateQRCode = ({ id }) => {
  return (
    <div>
      <h1>QR Code</h1>
      <QRCode value={`https://tangkapp.netlify.app/berkas/${id}`} size={256} />
    </div>
  );
};

export default GenerateQRCode;
