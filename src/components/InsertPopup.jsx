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
    
      // Filter namaKegiatan options based on selectedSubsek
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
        const {
            idBerkas,
            noBerkas,
            tahunBerkas,
            tanggalTerima,
            idKegiatan,
            namaSubsek,
            namaKegiatan,
            idPemohon,
            namaPemohon,
            idJenisHak,
            JenisHak,
            noHak,
            idDesa,
            namaDesa,
            namaKecamatan,
            tanggalSPS,
            pemohonBaru,
            idPetugasSPS,
            namaPetugasSPS,
            idPetugasUkur,
            namaPetugasUkur,
        } = formData;
    
        // Validasi semua kolom wajib
        const errors = {};
    
        if (!noBerkas) errors.noBerkas = "No Berkas wajib diisi.";
        if (!tanggalTerima) errors.tanggalTerima = "Tanggal Terima wajib diisi.";
        if (!idKegiatan) errors.idKegiatan = "Kegiatan wajib dipilih.";
        if (!namaSubsek) errors.namaSubsek = "Nama Subseksi wajib diisi.";
        if (!namaKegiatan) errors.namaKegiatan = "Nama Kegiatan wajib diisi.";
        if (!pemohonBaru && !idPemohon) errors.idPemohon = "Pemohon wajib dipilih.";
        if (pemohonBaru && !namaPemohon) errors.namaPemohon = "Nama Pemohon Baru wajib diisi.";
        if (!idJenisHak) errors.idJenisHak = "Jenis Hak wajib dipilih.";
        if (!JenisHak) errors.JenisHak = "Nama Jenis Hak wajib diisi.";
        if (!noHak) errors.noHak = "No Hak wajib diisi.";
        if (!idDesa) errors.idDesa = "Desa wajib dipilih.";
        if (!namaDesa) errors.namaDesa = "Nama Desa wajib diisi.";
        if (!namaKecamatan) errors.namaKecamatan = "Nama Kecamatan wajib diisi.";
        if (!idPetugasSPS) errors.idPetugasSPS = "Petugas SPS Wajib dipilih.";
        if (!namaPetugasSPS) errors.namaPetugasSPS = "Petugas SPS wajib dipilih.";
        if (!tanggalSPS) errors.tanggalSPS = "Tanggal SPS wajib diisi.";    
        if (!idPetugasUkur) errors.idPetugasUkur = "Petugas Ukur Wajib dipilih.";
        // Jika ada error, simpan ke state dan hentikan proses
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setAlertMessage("Harap periksa semua field yang wajib diisi!");
            return;
        }
    
        setValidationErrors({}); // Reset error jika validasi berhasil
        setLoading(true);
        try {
            const response = await axios.post("berkas/insert", formData);
            if (response.status === 200) {
                onInsertSuccess(response.data);
                onClose();
            }
        } catch (error) {
            setValidationErrors(errors);
            setAlertMessage(error.response.data.error);
            console.error("Gagal menambahkan data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const popupRef = useRef(null);
    useEffect(() => {
        if (alertMessage && popupRef.current) {
            popupRef.current.scrollTop = 0; // Scroll ke atas saat ada pesan error
        }
    }, [alertMessage]);
    return (
        <Dialog
    open={true}
    handler={onClose}
    className="w-full max-w-4xl"
>
    <DialogHeader>Tambah Berkas Baru</DialogHeader>
    <DialogBody
        divider
        className="overflow-y-auto max-h-[80vh] px-6"
    >
        {alertMessage && (
            <Alert color="red" className="mb-4">
                {alertMessage}
            </Alert>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tanggal Terima */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.tanggalTerima ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    Tanggal Terima
                </Typography>
                <Input
                    name="tanggalTerima"
                    type="date"
                    value={formData.tanggalTerima}
                    onChange={(e) =>
                        setFormData({ ...formData, tanggalTerima: e.target.value })
                    }
                    className={`${
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
                    className={`text-sm mb-1 ${
                        validationErrors.noBerkas ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    No Berkas
                </Typography>
                <Input
                    name="noBerkas"
                    type="number"
                    value={formData.noBerkas}
                    onChange={(e) =>
                        setFormData({ ...formData, noBerkas: e.target.value })
                    }
                    className={`${
                        validationErrors.noBerkas ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {validationErrors.noBerkas && (
                    <Typography className="text-red-500 text-sm mt-1">
                        {validationErrors.noBerkas}
                    </Typography>
                )}
            </div>

            {/* Tahun */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.tahunBerkas ? "text-red-500" : "text-gray-600"
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
                    className={`${
                        validationErrors.tahunBerkas ? "border-red-500" : "border-gray-300"
                    }`}
                />
            </div>

            {/* Subseksi */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.namaSubsek ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    Subseksi
                </Typography>
                <Select
                    options={subsekOptions}
                    placeholder="Pilih Subseksi"
                    value={selectedSubsek}
                    onChange={(selected) => {
                        setSelectedSubsek(selected);
                        setFormData({ ...formData, namaSubsek: selected?.value || "" });
                    }}
                    className={`${
                        validationErrors.namaSubsek ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {validationErrors.namaSubsek && (
                    <Typography className="text-red-500 text-sm mt-1">
                        Subseksi wajib dipilih.
                    </Typography>
                )}
            </div>

            {/* Kegiatan */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.idKegiatan ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    Kegiatan
                </Typography>
                <Select
                    options={kegiatanOptions}
                    placeholder="Pilih Kegiatan"
                    value={selectedKegiatan}
                    isDisabled={!selectedSubsek}
                    onChange={(selected) => {
                        setSelectedKegiatan(selected);
                        const item = dropdownData.kegiatan.find(
                            (k) => k._id === selected?.value
                        );
                        setFormData({
                            ...formData,
                            idKegiatan: item?._id || "",
                            namaKegiatan: item?.namaKegiatan || "",
                        });
                    }}
                    className={`${
                        validationErrors.idKegiatan ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {validationErrors.idKegiatan && (
                    <Typography className="text-red-500 text-sm mt-1">
                        Kegiatan wajib dipilih.
                    </Typography>
                )}
            </div>

            {/* Pemohon */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.idPemohon ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    Pemohon
                </Typography>
                <Select
                    options={dropdownData.pemohon}
                    placeholder="Pilih Pemohon"
                    onChange={(selected) => {
                        if (selected.isNew) {
                            setFormData({
                                ...formData,
                                pemohonBaru: true,
                                idPemohon: "",
                                namaPemohon: "",
                            });
                        } else {
                            setFormData({
                                ...formData,
                                pemohonBaru: false,
                                idPemohon: selected?.value || "",
                                namaPemohon: selected?.label || "",
                            });
                        }
                    }}
                />
                {formData.pemohonBaru && (
                    <Input
                        label="Nama Pemohon Baru"
                        value={formData.namaPemohon}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                namaPemohon: e.target.value.toUpperCase(),
                            })
                        }
                    />
                )}
                {validationErrors.idPemohon && (
                    <Typography className="text-red-500 text-sm mt-1">
                        Pemohon wajib dipilih.
                    </Typography>
                )}
            </div>

            {/* Jenis Hak */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.idJenisHak ? "text-red-500" : "text-gray-600"
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
                            (jh) => jh._id === selected?.value
                        );
                        setFormData({
                            ...formData,
                            idJenisHak: item?._id || "",
                            JenisHak: item?.JenisHak || "",
                        });
                    }}
                />
                {validationErrors.idJenisHak && (
                    <Typography className="text-red-500 text-sm mt-1">
                        Jenis Hak wajib dipilih.
                    </Typography>
                )}
            </div>

            {/* No Hak */}
            <div>
                <Typography
                    className={`text-sm mb-1 ${
                        validationErrors.noHak ? "text-red-500" : "text-gray-600"
                    }`}
                >
                    No Hak
                </Typography>
                <Input
                    value={formData.noHak}
                    type="number"
                    onChange={(e) => setFormData({ ...formData, noHak: e.target.value })}
                    className={`${
                        validationErrors.noHak ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {validationErrors.noHak && (
                    <Typography className="text-red-500 text-sm mt-1">
                        No Hak wajib diisi.
                    </Typography>
                )}
            </div>

            {/* Tambahkan PIC */}
            <div className="col-span-full">
                <Typography className="text-sm text-gray-600 mb-1">Tambahkan PIC</Typography>
                <div className="flex gap-2 flex-wrap">
                    <Input
                        label="Nama PIC"
                        value={newPIC.namaPIC}
                        onChange={(e) =>
                            setNewPIC({ ...newPIC, namaPIC: e.target.value })
                        }
                    />
                    <Input
                        label="Kontak PIC"
                        value={newPIC.kontakPIC}
                        onChange={(e) =>
                            setNewPIC({ ...newPIC, kontakPIC: e.target.value })
                        }
                    />
                    <Button variant="gradient" color="blue" onClick={handleInsertPIC}>
                        Tambah PIC
                    </Button>
                </div>
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