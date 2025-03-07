//import service api
import Api from "../services/api";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import react-confirm-alert
import { confirmAlert } from "react-confirm-alert";

//import CSS react-confirm-alert
import "react-confirm-alert/src/react-confirm-alert.css";

export default function DeleteButton({ id, endpoint, fetchData }) {
    // Get token from cookies
    const token = Cookies.get("token");

    // Function to show confirmation dialog
    const confirmDelete = () => {
        confirmAlert({
            title: "Apa Kamu Yakin?",
            message: "Apakah Anda ingin menghapus data ini?",
            buttons: [
                {
                    label: "YES",
                    onClick: deleteData,
                },
                {
                    label: "NO",
                    onClick: () => { },
                },
            ],
        });
    };

    // Function to handle data deletion
    const deleteData = async () => {
        try {
            // Set authorization header with token
            Api.defaults.headers.common["Authorization"] = token;

            // Call API to delete data
            await Api.delete(`${endpoint}/${id}`).then((response) => {
                // Show success notification
                toast.success(`${response.data.meta.message}`, {
                    duration: 5000,
                    position: "top-center",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });

                // Refresh data after deletion
                fetchData();
            });
        } catch (error) {
            toast.error("Failed to delete data!", {
                duration: 5000,
                position: "top-center",
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        }
    };

    return (
        <button className="btn btn-danger rounded" onClick={confirmDelete}>
            Delete
        </button>
    );
}
