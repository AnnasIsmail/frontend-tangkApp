import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import axios from "../../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpUpdateUser = ({ data, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    NIK: data.NIK || "",
    nama: data.nama || "",
    role: data.role || "",
    _id: data._id,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [controller] = useMaterialTailwindController();
  const { token } = controller;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.NIK.trim()) newErrors.NIK = "NIK tidak boleh kosong";
    if (!formData.nama.trim()) newErrors.nama = "Nama tidak boleh kosong";
    if (!formData.role.trim()) newErrors.role = "Role tidak boleh kosong";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.put(`users/${formData._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        onUpdateSuccess(response.data);
      }
    } catch (error) {
      alert("Gagal memperbarui user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} handler={onClose}>
      <DialogHeader>Edit User</DialogHeader>
      <DialogBody style={{ display: "grid", gap: "10px" }}>
        <Input
          label="NIK"
          value={formData.NIK}
          onChange={(e) => setFormData({ ...formData, NIK: e.target.value })}
          style={{
            borderColor: errors.NIK ? "red" : undefined,
          }}
        />
        {errors.NIK && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.NIK}</span>
        )}
        <Input
          label="Nama"
          value={formData.nama}
          onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          style={{
            borderColor: errors.nama ? "red" : undefined,
          }}
        />
        {errors.nama && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.nama}</span>
        )}
        <Select
          label="Role"
          value={formData.role}
          onChange={(value) => setFormData({ ...formData, role: value })}
        >
          <Option value="Admin">Admin</Option>
          <Option value="User">User</Option>
        </Select>
        {errors.role && (
          <span style={{ color: "red", fontSize: "12px" }}>{errors.role}</span>
        )}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Batal
        </Button>
        <Button variant="gradient" onClick={handleUpdate} disabled={loading}>
          {loading ? "Loading..." : "Simpan"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default PopUpUpdateUser;
