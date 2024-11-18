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
    <Typography variant="small" className="text-gray-600">
      <strong>{label}:</strong> {value || "-"}
    </Typography>
  );

  const renderTimeline = () => (
    <Timeline>
      {berkas.status?.map((status, index) => (
        <TimelineItem key={index}>
          {index > 0 && <TimelineConnector />}
          <TimelineHeader className="h-3">
            <TimelineIcon />
            <Typography variant="h6" color="blue-gray" className="leading-none">
              {status.nama} - {new Date(status.dateIn).toLocaleDateString()}
            </Typography>
          </TimelineHeader>
          <TimelineBody className="pb-4">
            {status?.statusDetail?.map((sub, subIndex) => (
              <div key={subIndex} className="pl-4">
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal text-gray-600"
                >
                  <strong>{sub.nama}</strong> ({new Date(sub.dateIn).toLocaleDateString()})
                </Typography>
                {sub.deskripsiKendala && (
                  <Typography
                    variant="small"
                    color="red"
                    className="mt-1 text-sm font-medium"
                  >
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
      <DialogHeader>Detail Berkas</DialogHeader>
      <DialogBody divider>
        <div className="grid gap-4">
          {renderField("ID Berkas", berkas.idBerkas)}
          {renderField("No Berkas", berkas.noBerkas)}
          {renderField("Tahun Berkas", berkas.tahunBerkas)}
          {renderField("Tanggal Terima", new Date(berkas.tanggalTerima).toLocaleDateString())}
          {renderField("Nama Pemohon", berkas.namaPemohon)}
          {berkas.PIC.map((x, y) => (
              <div key={y}>
                  {renderField(`Nama PIC Pemohon ${y + 1}`, x.namaPIC)}
                  {renderField(`Kontak PIC Pemohon ${y + 1}`, x.kontakPIC)}
              </div>
          ))}
          {renderField("Jenis Hak", berkas.JenisHak)}
          {renderField("Nomor Hak", berkas.noHak)}
          {renderField("Desa dan Kecamatan", berkas.namaDesa + berkas.namaKecamatan)}
          {renderField("Tanggal Entri", new Date(berkas.dateIn).toLocaleDateString())}
          {renderField("Status Perjalanan", berkas.status[berkas.status.length - 1].name)}
          {renderField("Substatus", berkas.status[berkas.status.length - 1]?.statusDetail[berkas.status[berkas.status.length - 1]?.statusDetail.length - 1]?.nama)}
          {berkas.deskripsiKendala && renderField("Deskripsi Kendala", berkas.deskripsiKendala)}
          {renderField("Nama Petugas Ukur", berkas.namaPetugasUkur)}
          {renderField("Status Alih Media", berkas.statusAlihMedia ? "Sudah" : "Belum")}
          {renderField("Status Bayar PNBP", berkas.statusBayarPNBP ? "Sudah" : "Belum")}

          {/* {renderField("Kegiatan", berkas.namaKegiatan)}
          {renderField("No Hak", berkas.noHak)}
          {renderField("ID SPS", berkas.idSPS)}
          {renderField("ID Petugas Ukur", berkas.idPetugasUkur)}
          {renderField("ID User", berkas.idUser)} */}
          <Typography variant="small" className="text-gray-600 font-bold mt-4">
            Status:
          </Typography>
          <div>{renderTimeline()}</div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DetailModal;
