import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
    Select,
    Option,
} from "@material-tailwind/react";
import axios from "../api/apiTangkApp";

const FilterPopUp = ({ isOpen, onClose, onApplyFilter }) => {
    const [filters, setFilters] = useState({
        tanggalTerimaStart: "",
        tanggalTerimaEnd: "",
        kegiatan: "",
        jenisHak: "",
        desa: "",
        petugasUkur: "",
    });

    const [dropdownData, setDropdownData] = useState({
        kegiatan: [],
        pemohon: [],
        jenisHak: [],
        desa: [],
        petugasUkur: [],
    });

    // Fetch data dropdown saat popup dibuka
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [kegiatanRes, pemohonRes, jenisHakRes, desaRes, petugasUkurRes] =
                    await Promise.all([
                        axios.get("berkas/kegiatan"),
                        axios.get("berkas/pemohon"),
                        axios.get("berkas/jenisHak"),
                        axios.get("berkas/desa"),
                        axios.get("berkas/petugasUkur"),
                    ]);

                setDropdownData({
                    kegiatan: kegiatanRes.data.map((item) => ({
                        label: item.namaKegiatan,
                        value: item.idKegiatan,
                    })),
                    pemohon: pemohonRes.data.map((item) => ({
                        label: item.namaPemohon,
                        value: item.idPemohon,
                    })),
                    jenisHak: jenisHakRes.data.map((item) => ({
                        label: item.JenisHak,
                        value: item.idJenisHak,
                    })),
                    desa: desaRes.data.map((item) => ({
                        label: `${item.namaDesa} - ${item.namaKecamatan}`,
                        value: item.idDesa,
                    })),
                    petugasUkur: petugasUkurRes.data.map((item) => ({
                        label: item.nama,
                        value: item.idPetugasUkur,
                    })),
                });
            } catch (error) {
                console.error("Gagal mengambil data dropdown:", error);
            }
        };

        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const handleSelectChange = (key, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    };

    const handleApplyFilter = () => {
        onApplyFilter(filters); 
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} handler={onClose}>
            <DialogHeader>Filter Data</DialogHeader>
            <DialogBody divider className="overflow-y-auto max-h-[80vh]">
                <div className="grid gap-4">
                    {/* Tanggal Terima Start */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Tanggal Terima (Start)
                        </Typography>
                        <Input
                            type="date"
                            name="tanggalTerimaStart"
                            value={filters.tanggalTerimaStart}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Tanggal Terima End */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Tanggal Terima (End)
                        </Typography>
                        <Input
                            type="date"
                            name="tanggalTerimaEnd"
                            value={filters.tanggalTerimaEnd}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Dropdown Kegiatan */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Kegiatan
                        </Typography>
                        <Select
                            label="Pilih Kegiatan"
                            onChange={(value) => handleSelectChange("kegiatan", value)}
                        >
                            {dropdownData.kegiatan.map((item) => (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Dropdown Jenis Hak */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Jenis Hak
                        </Typography>
                        <Select
                            label="Pilih Jenis Hak"
                            onChange={(value) => handleSelectChange("jenisHak", value)}
                        >
                            {dropdownData.jenisHak.map((item) => (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Dropdown Desa */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Desa
                        </Typography>
                        <Select
                            label="Pilih Desa"
                            onChange={(value) => handleSelectChange("desa", value)}
                        >
                            {dropdownData.desa.map((item) => (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Dropdown Petugas Ukur */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Petugas Ukur
                        </Typography>
                        <Select
                            label="Pilih Petugas Ukur"
                            onChange={(value) => handleSelectChange("petugasUkur", value)}
                        >
                            {dropdownData.petugasUkur.map((item) => (
                                <Option key={item.value} value={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={onClose} className="mr-2">
                    Batal
                </Button>
                <Button variant="gradient" color="blue" onClick={handleApplyFilter}>
                    Terapkan Filter
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default FilterPopUp;
