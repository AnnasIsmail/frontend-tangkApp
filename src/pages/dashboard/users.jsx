import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
  Chip,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import axios from "../../api/apiTangkApp";
import PopUpInsertUser from "@/components/users/InsertUser";
import PopUpUpdateUser from "@/components/users/UpdateUser";
import { useMaterialTailwindController } from "@/context";
import { Navigate } from "react-router-dom";

const colors = [
  "blue",
  "red",
  "green",
  "amber",
  "pink",
  "indigo",
  "purple",
  "teal",
  "cyan"
];


export function Users() {
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInsertPopup, setShowInsertPopup] = useState(false);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [controller] = useMaterialTailwindController();
  const { roleNow, token } = controller;
  const [refresh, setRefresh] = useState(false);

  if (roleNow !== "Admin") return <Navigate to="/dashboard/home" replace />;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsersData(response.data || []);
      } catch (error) {
        setError("Gagal memuat data users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleNow, token, refresh]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      try {
        await axios.delete(`user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRefresh(!refresh);
        alert("User berhasil dihapus!");
      } catch (error) {
        alert("Gagal menghapus user.");
      }
    }
  };

  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length); // Pilih indeks acak
    return colors[randomIndex]; // Kembalikan warna berdasarkan indeks acak
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
            Tabel Users
          </Typography>
          <Button
            variant="gradient"
            color="green"
            onClick={() => setShowInsertPopup(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah User
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
                    {["NIK", "Nama", "Role", "Action"].map((header) => (
                      <th key={header} className="text-left p-2">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user) => (
                    <tr key={user._id}>
                      <td className="p-2">{user.NIK}</td>
                      <td className="p-2">{user.nama}</td>
                      <td className="p-2">
                        <div style={{ display: "flex", gap: "5px" }}>
                          {user.role.map((x) => (
                            <Chip color={getRandomColor()} key={x} value={x} />
                          ))}
                        </div>
                      </td>
                      <td className="p-2 flex gap-2">
                        <IconButton
                          variant="text"
                          color="blue"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUpdatePopup(true);
                          }}
                        >
                          <PencilIcon className="h-5 w-5" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          color="red"
                          onClick={() => handleDeleteUser(user._id)}
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
        <PopUpInsertUser
          onClose={() => setShowInsertPopup(false)}
          onInsertSuccess={() => {
            setRefresh(!refresh);
            setShowInsertPopup(false);
          }}
        />
      )}

      {showUpdatePopup && selectedUser && (
        <PopUpUpdateUser
          data={selectedUser}
          onClose={() => setShowUpdatePopup(false)}
          onUpdateSuccess={() => {
            setRefresh(!refresh);
            setShowUpdatePopup(false);
          }}
        />
      )}
    </div>
  );
}

export default Users;
