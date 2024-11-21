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
      <Typography variant="h6" className="font-semibold text-gray-900">
        {label}
      </Typography>
      <Typography variant="small" className="text-gray-700 text-sm">
        {value || "-"}
      </Typography>
    </div>
  );

  const renderTimeline = () => (
    <Timeline>
      {berkas.status?.map((status, index) => (
        <TimelineItem key={index}>
          {index > 0 && <TimelineConnector />}
          <TimelineHeader>
            <TimelineIcon />
            <Typography variant="h6" color="blue-gray" className="text-lg font-bold">
              {status.name} - {new Date(status.dateIn).toLocaleDateString()}
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pl-8">
            {status?.statusDetail?.map((sub, subIndex) => (
              <div key={subIndex} className="mb-4">
                <Typography variant="small" color="gray" className="font-medium text-sm">
                  <strong>{sub.nama}</strong> ({new Date(sub.dateIn).toLocaleDateString()})
                  {sub.namaUser && <> oleh <strong>{sub.namaUser}</strong></>}
                </Typography>
                {sub.deskripsiKendala && (
                  <Typography variant="small" color="red" className="mt-1 text-sm font-medium">
                    Kendala: {sub.deskripsiKendala}
                  </Typography>
                )}
                {sub.notes && (
                  <Typography variant="small" color="green" className="mt-1 text-sm font-medium">
                    Catatan Selesai: {sub.notes}
                  </Typography>
                )}
                {sub.status === "Terhenti" && (
                  <Typography variant="small" color="amber" className="mt-1 text-sm font-medium">
                    Status Terhenti oleh <strong>{sub.namaUser}</strong>
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
      <DialogHeader className="text-2xl font-bold border-b pb-2">Detail Berkas</DialogHeader>
      <DialogBody divider className="overflow-y-auto max-h-[70vh]">
        {/* Informasi Berkas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kolom Kiri */}
          <div className="border-r pr-4">
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
          <div className="pl-4">
            {renderField("Desa dan Kecamatan", `${berkas.namaDesa} - ${berkas.namaKecamatan}`)}
            {renderField("Tanggal Entri", new Date(berkas.dateIn).toLocaleDateString())}
            {renderField("Status Perjalanan", berkas.status[berkas.status.length - 1]?.name)}
            {renderField(
              "Substatus",
              berkas.status[berkas.status.length - 1]?.statusDetail[
                berkas.status[berkas.status.length - 1]?.statusDetail.length - 1
              ]?.nama
            )}
            {berkas.deskripsiKendala && renderField("Deskripsi Kendala", berkas.deskripsiKendala)}
            {renderField("Nama Petugas Ukur", berkas.namaPetugasUkur)}
            {renderField("Status Alih Media", berkas.statusAlihMedia ? "Sudah" : "Belum")}
            {renderField("Status Bayar PNBP", berkas.statusBayarPNBP ? "Sudah" : "Belum")}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6 border-t pt-4">
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
