import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import Select from "react-select";
import axios from "../api/apiTangkApp";

const FilterPopUp = ({ isOpen, onClose, onApplyFilter }) => {
    const initialFilters = {
        tanggalTerimaStart: "",
        tanggalTerimaEnd: "",
        kegiatan: "",
        jenisHak: "",
        desa: "",
        petugasUkur: "",
    };

    const [filters, setFilters] = useState(initialFilters);

    const [dropdownData, setDropdownData] = useState({
        kegiatan: [],
        jenisHak: [],
        desa: [],
        petugasUkur: [],
    });

    // Fetch data dropdown saat popup dibuka
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [kegiatanRes, jenisHakRes, desaRes, petugasUkurRes] = await Promise.all([
                    axios.get("berkas/kegiatan"),
                    axios.get("berkas/jenisHak"),
                    axios.get("berkas/desa"),
                    axios.get("berkas/petugasUkur"),
                ]);

                setDropdownData({
                    kegiatan: kegiatanRes.data.map((item) => ({
                        label: item.namaKegiatan,
                        value: item.idKegiatan,
                    })),
                    jenisHak: jenisHakRes.data.map((item) => ({
                        label: item.JenisHak,
                        value: item.idJenisHak,
                    })),
                    desa: desaRes.data.map((item) => ({
                        label: item.namaDesa + " - " + item.namaKecamatan,
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

    const handleSelectChange = (key, selectedOption) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [key]: selectedOption ? selectedOption.value : "",
        }));
    };

    const handleApplyFilter = () => {
        onApplyFilter(filters);
        onClose();
    };

    const handleResetFilter = () => {
        setFilters(initialFilters);
        onApplyFilter(initialFilters);
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
                            options={dropdownData.kegiatan}
                            placeholder="Pilih Kegiatan"
                            isClearable
                            value={dropdownData.kegiatan.find(
                                (option) => option.value === filters.kegiatan
                            )}
                            onChange={(selected) => handleSelectChange("kegiatan", selected)}
                        />
                    </div>

                    {/* Dropdown Jenis Hak */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Jenis Hak
                        </Typography>
                        <Select
                            options={dropdownData.jenisHak}
                            placeholder="Pilih Jenis Hak"
                            isClearable
                            value={dropdownData.jenisHak.find(
                                (option) => option.value === filters.jenisHak
                            )}
                            onChange={(selected) => handleSelectChange("jenisHak", selected)}
                        />
                    </div>

                    {/* Dropdown Desa */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Desa
                        </Typography>
                        <Select
                            options={dropdownData.desa}
                            placeholder="Pilih Desa"
                            isClearable
                            value={dropdownData.desa.find(
                                (option) => option.value === filters.desa
                            )}
                            onChange={(selected) => handleSelectChange("desa", selected)}
                        />
                    </div>

                    {/* Dropdown Petugas Ukur */}
                    <div>
                        <Typography className="text-sm text-gray-600 mb-1">
                            Petugas Ukur
                        </Typography>
                        <Select
                            options={dropdownData.petugasUkur}
                            placeholder="Pilih Petugas Ukur"
                            isClearable
                            value={dropdownData.petugasUkur.find(
                                (option) => option.value === filters.petugasUkur
                            )}
                            onChange={(selected) => handleSelectChange("petugasUkur", selected)}
                        />
                    </div>
                </div>
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={handleResetFilter} className="mr-2">
                    Reset
                </Button>
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
