import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import axios from "../../api/apiTangkApp";
import PopUpInsertPetugas from "@/components/petugas_ukur/InsertPetugasUkur";
import PopUpUpdatePetugas from "@/components/petugas_ukur/PopUpUpdatePetugasUkur";
import { useMaterialTailwindController } from "@/context";

export function PetugasUkur () {
  const [petugasData, setPetugasData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInsertPopup, setShowInsertPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedPetugas, setSelectedPetugas] = useState(null);
  const [controller] = useMaterialTailwindController();
  const { roleNow, token } = controller;

  useEffect(() => {
    if (roleNow !== "Admin") return; // Batasi akses hanya untuk Admin

    const fetchPetugas = async () => {
      setLoading(true);
      try {
        const response = await axios.get("petugas-ukur", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPetugasData(response.data || []);
      } catch (error) {
        setError("Gagal memuat data petugas ukur.");
      } finally {
        setLoading(false);
      }
    };

    fetchPetugas();
  }, [roleNow, token]);

  const handleDeletePetugas = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus petugas ini?")) {
      try {
        await axios.delete(`petugas-ukur/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPetugasData((prevData) => prevData.filter((item) => item._id !== id));
        alert("Petugas berhasil dihapus!");
      } catch (error) {
        alert("Gagal menghapus petugas.");
      }
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-8 p-6 flex justify-between items-center"
        >
          <Typography variant="h6" color="white">
            Tabel Petugas Ukur
          </Typography>
          <Button
            variant="gradient"
            color="green"
            onClick={() => setShowInsertPopup(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Petugas
          </Button>
        </CardHeader>
        <CardBody>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="red">{error}</Typography>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    {["ID Petugas", "NIK", "Nama", "Action"].map((header) => (
                      <th key={header} className="text-left p-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {petugasData.map((petugas) => (
                    <tr key={petugas._id}>
                      <td className="p-2">{petugas.idPetugasUkur}</td>
                      <td className="p-2">{petugas.NIK}</td>
                      <td className="p-2">{petugas.nama}</td>
                      <td className="p-2 flex gap-2">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => {
                            setSelectedPetugas(petugas);
                            setShowUpdatePopup(true);
                          }}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDeletePetugas(petugas._id)}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {showInsertPopup && (
        <PopUpInsertPetugas
          onClose={() => setShowInsertPopup(false)}
          onInsertSuccess={(newPetugas) => {
            setPetugasData((prev) => [...prev, newPetugas]);
            setShowInsertPopup(false);
          }}
        />
      )}

      {showUpdatePopup && selectedPetugas && (
        <PopUpUpdatePetugas
          data={selectedPetugas}
          onClose={() => setShowUpdatePopup(false)}
          onUpdateSuccess={(updatedPetugas) => {
            setPetugasData((prev) =>
              prev.map((item) =>
                item._id === updatedPetugas._id ? updatedPetugas : item
              )
            );
            setShowUpdatePopup(false);
          }}
        />
      )}
    </div>
  );
};

export default PetugasUkur;
