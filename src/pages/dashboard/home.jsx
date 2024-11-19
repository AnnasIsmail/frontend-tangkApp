import React, { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
    Alert,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "../../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpInsertBerkas = ({ onClose, onInsertSuccess }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);

    const [controller] = useMaterialTailwindController();
    const { user } = controller;
    const [alertMessage, setAlertMessage] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        idBerkas: "",
        noBerkas: "",
        tahunBerkas: currentYear,
        tanggalTerima: "",
        idKegiatan: "",
        namaSubsek: "",
        namaKegiatan: "",
        idPemohon: "",
        namaPemohon: "",
        pemohonBaru: false,
        idJenisHak: "",
        JenisHak: "",
        noHak: "",
        idDesa: "",
        namaDesa: "",
        namaKecamatan: "",
        idPetugasUkur: "",
        namaPetugasUkur: "",
        idPetugasSPS: "",
        namaPetugasSPS: "",
        tanggalSPS: "",
        statusAlihMedia: false,
        statusBayarPNBP: false,
        PIC: [],
        idUser: user._id,
    });

    const [dropdownData, setDropdownData] = useState({
        kegiatan: [],
        pemohon: [],
        jenisHak: [],
        desa: [],
        petugasUkur: [],
        petugasSPS: [],
    });

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [kegiatanRes, pemohonRes, jenisHakRes, desaRes, petugasUkurRes, petugasSPSRes] =
                    await Promise.all([
                        axios.get("berkas/kegiatan"),
                        axios.get("berkas/pemohon"),
                        axios.get("berkas/jenisHak"),
                        axios.get("berkas/desa"),
                        axios.get("berkas/petugasUkur"),
                        axios.get("berkas/petugasSPS"),
                    ]);

                setDropdownData({
                    kegiatan: kegiatanRes.data,
                    pemohon: [
                        { label: "Belum Terdaftar", value: "baru", isNew: true },
                        ...pemohonRes.data.map((item) => ({
                            label: item.namaPemohon,
                            value: item._id,
                        })),
                    ],
                    jenisHak: jenisHakRes.data,
                    desa: desaRes.data,
                    petugasUkur: petugasUkurRes.data,
                    petugasSPS: petugasSPSRes.data,
                });
            } catch (error) {
                console.error("Gagal mengambil data dropdown:", error);
            }
        };

        fetchDropdownData();
    }, []);

    const handleInsert = async () => {
        const errors = {};

        if (!formData.noBerkas) errors.noBerkas = "No Berkas wajib diisi.";
        if (!formData.tanggalTerima) errors.tanggalTerima = "Tanggal Terima wajib diisi.";
        if (!formData.idKegiatan) errors.idKegiatan = "Kegiatan wajib dipilih.";
        if (!formData.namaSubsek) errors.namaSubsek = "Nama Subseksi wajib diisi.";
        if (!formData.namaKegiatan) errors.namaKegiatan = "Nama Kegiatan wajib diisi.";
        if (!formData.pemohonBaru && !formData.idPemohon) {
            errors.idPemohon = "Pemohon wajib dipilih.";
        }
        if (formData.pemohonBaru && !formData.namaPemohon) {
            errors.namaPemohon = "Nama Pemohon Baru wajib diisi.";
        }
        if (!formData.idJenisHak) errors.idJenisHak = "Jenis Hak wajib dipilih.";
        if (!formData.JenisHak) errors.JenisHak = "Nama Jenis Hak wajib diisi.";
        if (!formData.noHak) errors.noHak = "No Hak wajib diisi.";
        if (!formData.idDesa) errors.idDesa = "Desa wajib dipilih.";
        if (!formData.namaDesa) errors.namaDesa = "Nama Desa wajib diisi.";
        if (!formData.namaKecamatan) errors.namaKecamatan = "Nama Kecamatan wajib diisi.";
        if (!formData.namaPetugasSPS) errors.namaPetugasSPS = "Petugas SPS wajib dipilih.";
        if (!formData.tanggalSPS) errors.tanggalSPS = "Tanggal SPS wajib diisi.";

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setAlertMessage("Harap periksa semua field yang wajib diisi!");
            return;
        }

        setValidationErrors({});
        setLoading(true);
        try {
            const response = await axios.post("berkas/insert", formData);
            if (response.status === 200) {
                onInsertSuccess(response.data);
                onClose();
            }
        } catch (error) {
            console.error("Gagal menambahkan data:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderInputField = (label, name, type = "text", isDisabled = false) => (
        <div>
            <Typography
                className={`text-sm mb-1 ${
                    validationErrors[name] ? "text-red-500" : "text-gray-600"
                }`}
            >
                {label}
            </Typography>
            <Input
                label={label}
                name={name}
                type={type}
                value={formData[name]}
                disabled={isDisabled}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className={`${
                    validationErrors[name] ? "border-red-500" : "border-gray-300"
                }`}
            />
            {validationErrors[name] && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors[name]}
                </Typography>
            )}
        </div>
    );

    const renderSelectField = (label, name, options, isDropdown = true) => (
        <div>
            <Typography
                className={`text-sm mb-1 ${
                    validationErrors[name] ? "text-red-500" : "text-gray-600"
                }`}
            >
                {label}
            </Typography>
            {isDropdown ? (
                <Select
                    options={options}
                    placeholder={`Pilih ${label}`}
                    className={`${
                        validationErrors[name] ? "border-red-500" : "border-gray-300"
                    }`}
                    onChange={(selected) =>
                        setFormData({ ...formData, [name]: selected.value })
                    }
                />
            ) : (
                <Input
                    label={label}
                    name={name}
                    value={formData[name]}
                    onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                />
            )}
            {validationErrors[name] && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors[name]}
                </Typography>
            )}
        </div>
    );

    return (
        <Dialog open={true} handler={onClose}>
            <DialogHeader>Tambah Berkas Baru</DialogHeader>
            <DialogBody divider className="overflow-y-auto max-h-[80vh]">
                {alertMessage && (
                    <Alert color="red" className="mb-4">
                        {alertMessage}
                    </Alert>
                )}
                <div className="grid gap-4">
                    {renderInputField("No Berkas", "noBerkas", "number")}
                    {renderInputField("Tanggal Terima", "tanggalTerima", "date")}
                    {renderSelectField(
                        "Kegiatan",
                        "idKegiatan",
                        dropdownData.kegiatan.map((item) => ({
                            label: item.namaKegiatan,
                            value: item._id,
                        }))
                    )}
                    {renderInputField("Nama Subseksi", "namaSubsek")}
                    {renderInputField("Nama Kegiatan", "namaKegiatan")}
                    {renderSelectField(
                        "Pemohon",
                        "idPemohon",
                        dropdownData.pemohon.map((item) => ({
                            label: item.label,
                            value: item.value,
                        })),
                        true
                    )}
                    {renderSelectField(
                        "Jenis Hak",
                        "idJenisHak",
                        dropdownData.jenisHak.map((item) => ({
                            label: item.JenisHak,
                            value: item._id,
                        }))
                    )}
                    {renderInputField("No Hak", "noHak", "number")}
                    {renderSelectField(
                        "Desa",
                        "idDesa",
                        dropdownData.desa.map((item) => ({
                            label: `${item.namaDesa} - ${item.namaKecamatan}`,
                            value: item._id,
                        }))
                    )}
                    {renderInputField("Nama Kecamatan", "namaKecamatan")}
                    {renderSelectField(
                        "Petugas SPS",
                        "idPetugasSPS",
                        dropdownData.petugasSPS.map((item) => ({
                            label: item.namaPetugas,
                            value: item._id,
                        }))
                    )}
                    {renderInputField("Tanggal SPS", "tanggalSPS", "date")}
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={onClose} className="mr-2">
                    Batal
                </Button>
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleInsert}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Tambah"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default PopUpInsertBerkas;
