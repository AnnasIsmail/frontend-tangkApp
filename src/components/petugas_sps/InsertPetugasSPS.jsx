import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";
import axios from "../../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpInsertPetugas = ({ onClose, onInsertSuccess }) => {
  const [formData, setFormData] = useState({
    namaPetugas: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { token } = controller;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.namaPetugas.trim())
      newErrors.namaPetugas = "Nama Petugas tidak boleh kosong";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInsert = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("petugas-sps", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        onInsertSuccess();
      }
    } catch (error) {
      alert("Gagal menambahkan petugas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader>Tambah Petugas SPS</DialogHeader>
      <DialogBody>
        <Input
          label="Nama Petugas"
          value={formData.namaPetugas}
          onChange={(e) =>
            setFormData({ ...formData, namaPetugas: e.target.value.toUpperCase() })
          }
          style={{
            borderColor: errors.namaPetugas ? "red" : undefined,
          }}
        />
        {errors.namaPetugas && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {errors.namaPetugas}
          </span>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Batal
        </Button>
        <Button variant="gradient" onClick={handleInsert} disabled={loading}>
          {loading ? "Loading..." : "Tambah"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PopUpInsertPetugas;
