import React, { useState, useRef, useEffect } from "react";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import service api
import Api from "../../../services/api";

//import handler error
import { handleErrors } from "../../../utils/handleErrors";

export default function CreateHP({ fetchDataHandPhone, fetchHandPhone }) {
    //state
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Loading state


    const modalRef = useRef(null); // Create a ref for the modal

    //token
    const token = Cookies.get("token");

    //function "storeProduct"
    //function "storeUser"
    const storeHp = async (e) => {
        e.preventDefault();

        //set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        await Api.post("/api/hand-phone", {
            //data
            name: name
        })
            .then((response) => {
                //show toast
                toast.success(`${response.data.meta.message}`, {
                    duration: 4000,
                    position: "top-right",
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });

                // Hide the modal
                const modalElement = modalRef.current;
                const modalInstance = bootstrap.Modal.getInstance(modalElement);
                modalInstance.hide();

                // Call function "fetchHandPhone" to refresh handphone list
                fetchHandPhone();

                // Reset form
                setName("");
            })
            .catch((error) => {
                //assign error to function "handleErrors"
                handleErrors(error.response.data, setErrors);
            });
    };

    return (
        <>
            <a
                href="#"
                className="btn btn-danger d-sm-inline-block"
                data-bs-toggle="modal"
                data-bs-target="#modal-create-hp"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                </svg>
                Add New Jenis HP
            </a>
            <div
                className="modal modal-blur fade"
                id="modal-create-hp"
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
                ref={modalRef}
            >
                <div
                    className="modal-dialog modal-lg"
                    role="document"
                >
                    <form onSubmit={storeHp}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Jenis HP</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                            {errors.name && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <a
                                    href="#"
                                    className="btn me-auto rounded"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    className="btn btn-primary ms-auto rounded"
                                    disabled={loading}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        strokeWidth="2"
                                        stroke="currentColor"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 5l0 14" />
                                        <path d="M5 12l14 0" />
                                    </svg>
                                    {loading ? "Proses menyimpan..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
