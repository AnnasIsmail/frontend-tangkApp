import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineBody,
} from "@material-tailwind/react";

const DetailModal = ({ berkas, onClose }) => {
  const renderField = (label, value) => (
    <div className="mb-4">
      <Typography variant="h6" className="font-bold text-gray-800">
        {label}
      </Typography>
      <Typography variant="small" className="text-gray-600">
        {value || "-"}
      </Typography>
    </div>
  );

  const renderTimeline = () => (
    <Timeline>
      {berkas.status?.map((status, index) => (
        <TimelineItem key={index}>
          {index > 0 && <TimelineConnector />}
          <TimelineHeader className="h-3">
            <TimelineIcon />
            <Typography variant="h6" color="blue-gray" className="leading-none text-lg font-bold">
              {status.nama} - {new Date(status.dateIn).toLocaleDateString()}
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-4">
            {status?.statusDetail?.map((sub, subIndex) => (
              <div key={subIndex} className="pl-6">
                <Typography variant="small" color="gray" className="font-normal text-gray-600 text-base">
                  <strong>{sub.nama}</strong> ({new Date(sub.dateIn).toLocaleDateString()})
                </Typography>
                {sub.deskripsiKendala && (
                  <Typography variant="small" color="red" className="mt-1 text-sm font-medium">
                    Kendala: {sub.deskripsiKendala}
                  </Typography>
                )}
              </div>
            ))}
          </TimelineBody>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader className="text-2xl font-bold">Detail Berkas</DialogHeader>
      <DialogBody divider className="overflow-y-auto max-h-[70vh]"> {/* Added scroll here */}
        <div className="grid grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div>
            {renderField("ID Berkas", berkas.idBerkas)}
            {renderField("No Berkas", berkas.noBerkas)}
            {renderField("Tahun Berkas", berkas.tahunBerkas)}
            {renderField("Tanggal Terima", new Date(berkas.tanggalTerima).toLocaleDateString())}
            {renderField("Nama Pemohon", berkas.namaPemohon)}
            {berkas.PIC?.map((x, y) => (
              <div key={y}>
                {renderField(`Nama PIC Pemohon ${y + 1}`, x.namaPIC)}
                {renderField(`Kontak PIC Pemohon ${y + 1}`, x.kontakPIC)}
              </div>
            ))}
            {renderField("Jenis Hak", berkas.JenisHak)}
            {renderField("Nomor Hak", berkas.noHak)}
          </div>

          {/* Kolom Kanan */}
          <div>
            {renderField("Desa dan Kecamatan", `${berkas.namaDesa} - ${berkas.namaKecamatan}`)}
            {renderField("Tanggal Entri", new Date(berkas.dateIn).toLocaleDateString())}
            {renderField("Status Perjalanan", berkas.status[berkas.status.length - 1]?.name)}
            {renderField("Substatus", berkas.status[berkas.status.length - 1]?.statusDetail[berkas.status[berkas.status.length - 1]?.statusDetail.length - 1]?.nama)}
            {berkas.deskripsiKendala && renderField("Deskripsi Kendala", berkas.deskripsiKendala)}
            {renderField("Nama Petugas Ukur", berkas.namaPetugasUkur)}
            {renderField("Status Alih Media", berkas.statusAlihMedia ? "Sudah" : "Belum")}
            {renderField("Status Bayar PNBP", berkas.statusBayarPNBP ? "Sudah" : "Belum")}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <Typography variant="h6" className="text-lg font-bold text-gray-800 mb-4">
            Timeline Status
          </Typography>
          {renderTimeline()}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose} className="mr-2">
          Tutup
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DetailModal;
