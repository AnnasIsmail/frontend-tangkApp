import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Input, Button } from "@material-tailwind/react";
import axios from "../../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpUpdatePetugas = ({ data, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { token } = controller;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `petugas-ukur/${formData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      alert("Gagal memperbarui petugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader>Edit Petugas Ukur</DialogHeader>
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
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Loading..." : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PopUpUpdatePetugas;
