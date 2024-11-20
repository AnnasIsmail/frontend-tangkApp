import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button } from "@material-tailwind/react";
import axios from "../../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpInsertPetugas = ({ onClose, onInsertSuccess }) => {
  const [formData, setFormData] = useState({
    idPetugasUkur: "",
    NIK: "",
    nama: "",
  });
  const [loading, setLoading] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { token } = controller;

  const handleInsert = async () => {
    setLoading(true);
    try {
      const response = await axios.post("petugas-ukur", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        onInsertSuccess(response.data);
      }
    } catch (error) {
      alert("Gagal menambahkan petugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader>Tambah Petugas Ukur</DialogHeader>
      <DialogBody>
        <Input
          label="ID Petugas"
          value={formData.idPetugasUkur}
          onChange={(e) =>
            setFormData({ ...formData, idPetugasUkur: e.target.value })
          }
        />
        <Input
          label="NIK"
          value={formData.NIK}
          onChange={(e) => setFormData({ ...formData, NIK: e.target.value })}
        />
        <Input
          label="Nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Batal
        </Button>
        <Button
          variant="gradient"
          onClick={handleInsert}
          disabled={loading}
        >
          {loading ? "Loading..." : "Tambah"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PopUpInsertPetugas;
