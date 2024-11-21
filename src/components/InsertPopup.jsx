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
import axios from "../api/apiTangkApp";
import { useMaterialTailwindController } from "@/context";

const PopUpInsertBerkas = ({ onClose, onInsertSuccess }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i);

    const [controller] = useMaterialTailwindController();
    const { user } = controller;
    const [alertMessage, setAlertMessage] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
    const [selectedSubsek, setSelectedSubsek] = useState(null);
    const [selectedKegiatan, setSelectedKegiatan] = useState(null);

    const [formData, setFormData] = useState({
        idBerkas: "",
        noBerkas: "",
        tahunBerkas: currentYear,
        tanggalTerima: new Date().toISOString().split('T')[0], // Default tanggal hari ini
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
        idUser: user._id
    });    

    const [newPIC, setNewPIC] = useState({ namaPIC: "", kontakPIC: "" }); // Menampung input PIC baru

    const [dropdownData, setDropdownData] = useState({
        kegiatan: [],
        pemohon: [],
        jenisHak: [],
        desa: [],
        petugasUkur: [],
        petugasSPS:[]
    });

    useEffect(() => {
        if (formData.noBerkas && formData.tahunBerkas) {
            setFormData((prev) => ({
                ...prev,
                idBerkas: `${formData.noBerkas}${formData.tahunBerkas}`,
            }));
        }
    }, [formData.noBerkas, formData.tahunBerkas]);

    const [loading, setLoading] = useState(false);

    // Fetch dropdown data
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
                    petugasSPS: petugasSPSRes.data
                });
            } catch (error) {
                console.error("Gagal mengambil data dropdown:", error);
            }
        };

        fetchDropdownData();
    }, []);

    const subsekOptions = [
        ...new Set(dropdownData.kegiatan.map((item) => item.namaSubsek)),
    ].map((namaSubsek) => ({ label: namaSubsek, value: namaSubsek }));
    
    const kegiatanOptions = dropdownData.kegiatan
        .filter((item) => item.namaSubsek === selectedSubsek?.value)
        .map((item) => ({
            label: item.namaKegiatan,
            value: item._id,
        }));

    const handleInsertPIC = () => {
        if (newPIC.namaPIC && newPIC.kontakPIC) {
            setFormData((prev) => ({
                ...prev,
                PIC: [...prev.PIC, { ...newPIC }],
            }));
            setNewPIC({ namaPIC: "", kontakPIC: "" }); // Reset input PIC
        }
    };

    const handleRemovePIC = (index) => {
        setFormData((prev) => ({
            ...prev,
            PIC: prev.PIC.filter((_, i) => i !== index),
        }));
    };

    const handleInsert = async () => {
        // Validation & Error Handling
        const errors = {};

        if (!formData.noBerkas) errors.noBerkas = "No Berkas wajib diisi.";
        // ... Repeat for all required fields

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setAlertMessage("Harap periksa semua field yang wajib diisi!");
            return;
        }

        setValidationErrors({}); // Clear errors on success
        setLoading(true);
        try {
            const response = await axios.post("berkas/insert", formData);
            if (response.status === 200) {
                onInsertSuccess(response.data);
                onClose();
            }
        } catch (error) {
            setAlertMessage(error.response?.data?.error || "Gagal menambahkan data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} handler={onClose} className="w-full max-w-3xl">
            <DialogHeader>Tambah Berkas Baru</DialogHeader>
            <DialogBody divider className="overflow-y-auto max-h-[80vh] p-6" ref={popupRef}>
    {alertMessage && (
        <Alert color="red" className="mb-4">
            {alertMessage}
        </Alert>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hidden ID Berkas */}
        <Input
            hidden
            name="idBerkas"
            value={formData.idBerkas}
            onChange={(e) => setFormData({ ...formData, idBerkas: e.target.value })}
            disabled
        />

        {/* Tanggal Terima */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.tanggalTerima ? "text-red-500" : "text-gray-700"
                }`}
            >
                Tanggal Terima
            </Typography>
            <Input
                name="tanggalTerima"
                type="date"
                value={formData.tanggalTerima}
                onChange={(e) => setFormData({ ...formData, tanggalTerima: e.target.value })}
                className={`w-full ${
                    validationErrors.tanggalTerima ? "border-red-500" : "border-gray-300"
                }`}
            />
            {validationErrors.tanggalTerima && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors.tanggalTerima}
                </Typography>
            )}
        </div>

        {/* No Berkas */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.noBerkas ? "text-red-500" : "text-gray-700"
                }`}
            >
                No Berkas
            </Typography>
            <Input
                name="noBerkas"
                type="number"
                value={formData.noBerkas}
                onChange={(e) => setFormData({ ...formData, noBerkas: e.target.value })}
                className={`w-full ${
                    validationErrors.noBerkas ? "border-red-500" : "border-gray-300"
                }`}
            />
            {validationErrors.noBerkas && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors.noBerkas}
                </Typography>
            )}
        </div>

        {/* Tahun Berkas */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.tahunBerkas ? "text-red-500" : "text-gray-700"
                }`}
            >
                Tahun
            </Typography>
            <Select
                options={years.map((year) => ({ label: year, value: year }))}
                placeholder="Pilih Tahun"
                defaultValue={{ label: currentYear, value: currentYear }}
                onChange={(selected) =>
                    setFormData({ ...formData, tahunBerkas: selected.value })
                }
                className={`w-full ${
                    validationErrors.tahunBerkas ? "border-red-500" : "border-gray-300"
                }`}
            />
        </div>

        {/* Subseksi */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.idKegiatan ? "text-red-500" : "text-gray-700"
                }`}
            >
                Subsek
            </Typography>
            <Select
                options={subsekOptions}
                placeholder="Pilih Subsek"
                onChange={(selected) => {
                    setSelectedSubsek(selected);
                }}
                className="w-full"
            />
            {validationErrors.idKegiatan && (
                <Typography className="text-red-500 text-sm mt-1">
                    Subsek wajib Dipilih
                </Typography>
            )}
        </div>

        {/* Nama Kegiatan */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.idKegiatan ? "text-red-500" : "text-gray-700"
                }`}
            >
                Kegiatan
            </Typography>
            <Select
                options={kegiatanOptions}
                placeholder="Pilih Kegiatan"
                isDisabled={!selectedSubsek}
                onChange={(selected) => {
                    setSelectedKegiatan(selected);
                    const item = dropdownData.kegiatan.find(
                        (k) => k._id === selected.value
                    );
                    setFormData({
                        ...formData,
                        idKegiatan: item._id,
                        namaSubsek: item.namaSubsek,
                        namaKegiatan: item.namaKegiatan,
                    });
                }}
                className="w-full"
            />
            {validationErrors.idKegiatan && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors.idKegiatan}
                </Typography>
            )}
        </div>

        {/* Pemohon */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.idPemohon ? "text-red-500" : "text-gray-700"
                }`}
            >
                Pemohon
            </Typography>
            <Select
                options={dropdownData.pemohon}
                placeholder="Pilih atau Tambah Pemohon"
                onChange={(selected) => {
                    if (selected.isNew) {
                        setFormData({ ...formData, pemohonBaru: true, idPemohon: "", namaPemohon: "" });
                    } else {
                        setFormData({
                            ...formData,
                            pemohonBaru: false,
                            idPemohon: selected.value,
                            namaPemohon: selected.label,
                        });
                    }
                }}
                className="w-full"
            />
            {formData.pemohonBaru && (
                <Input
                    label="Nama Pemohon Baru"
                    value={formData.namaPemohon}
                    onChange={(e) =>
                        setFormData({ ...formData, namaPemohon: e.target.value.toUpperCase() })
                    }
                    className="w-full mt-2"
                />
            )}
            {validationErrors.idPemohon && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors.idPemohon}
                </Typography>
            )}
        </div>

        {/* Jenis Hak */}
        <div>
            <Typography
                className={`text-sm font-medium mb-1 ${
                    validationErrors.idJenisHak ? "text-red-500" : "text-gray-700"
                }`}
            >
                Jenis Hak
            </Typography>
            <Select
                options={dropdownData.jenisHak.map((item) => ({
                    label: item.JenisHak,
                    value: item._id,
                }))}
                placeholder="Pilih Jenis Hak"
                onChange={(selected) => {
                    const item = dropdownData.jenisHak.find(
                        (jh) => jh._id === selected.value
                    );
                    setFormData({ ...formData, idJenisHak: item._id, JenisHak: item.JenisHak });
                }}
                className="w-full"
            />
            {validationErrors.idJenisHak && (
                <Typography className="text-red-500 text-sm mt-1">
                    {validationErrors.idJenisHak}
                </Typography>
            )}
        </div>

        {/* Tambahkan PIC */}
        <div className="col-span-2">
            <Typography className="text-sm font-medium mb-2">Tambahkan PIC</Typography>
            <div className="flex gap-2">
                <Input
                    label="Nama PIC"
                    value={newPIC.namaPIC}
                    onChange={(e) =>
                        setNewPIC({ ...newPIC, namaPIC: e.target.value })
                    }
                    className="w-full"
                />
                <Input
                    label="Kontak PIC"
                    value={newPIC.kontakPIC}
                    onChange={(e) =>
                        setNewPIC({ ...newPIC, kontakPIC: e.target.value })
                    }
                    className="w-full"
                />
                <Button
                    variant="gradient"
                    color="blue"
                    onClick={handleInsertPIC}
                >
                    Tambah
                </Button>
            </div>
            <ul className="mt-4 space-y-2">
                {formData.PIC.map((pic, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                    >
                        <Typography>
                            {pic.namaPIC} - {pic.kontakPIC}
                        </Typography>
                        <Button
                            variant="text"
                            color="red"
                            onClick={() => handleRemovePIC(index)}
                        >
                            Hapus
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    </div>
</DialogBody>

            <DialogFooter>
                <Button
                    variant="text"
                    color="red"
                    onClick={onClose}
                    className="mr-2"
                >
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
