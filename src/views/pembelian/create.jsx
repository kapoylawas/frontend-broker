import React, { useState, useRef, useEffect } from "react";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import service api
import Api from "../../services/api";

//import handler error
import { handleErrors } from "../../utils/handleErrors";

export default function PembelianCreate({ fetchData }) {
    const [supplierId, setSupplierId] = useState("");
    const [imei, setImei] = useState("");
    const [handPhone, setHandPhone] = useState("");
    const [hargaPembelian, setHargaPembelian] = useState("")
    const [sales, setSales] = useState("")
    const [tanggalPembelian, setTanggalPembelian] = useState("")
    const [jenisPembelian, setJenisPembelian] = useState("")
    const [catatan, setCatatan] = useState("");
    const [errors, setErrors] = useState({});

    //state categories
    const [supplier, setSupplier] = useState([]);

    //ref
    const modalRef = useRef(null); // Create a ref for the modal

    //token
    const token = Cookies.get("token");

    //function "fetchCategories"
    const fetchSupplier = async () => {
        //set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        await Api.get("/api/supplier-all").then((response) => {
            //set data response to state "catgeories"
            setSupplier(response.data.data);
        });
    };

    //hook
    useEffect(() => {
        //call function "fetchCategories"
        fetchSupplier();
    }, []);

    //function "storeProduct"
    const storeBarangMasuk = async (e) => {
        e.preventDefault();

        await Api.post("/api/barang-masuk", {
            //data
            supplier_id: supplierId,
            imei: imei,
            handphone_id: handPhone,
            harga_pembelian: hargaPembelian,
            sales: sales,
            tanggal_pembelian: tanggalPembelian,
            jenis_pembelian: jenisPembelian,
            catatan_awal: catatan,
        })
            .then((response) => {
                //show toast
                toast.success(`${response.data.meta.message}`, {
                    duration: 5000,
                    position: "top-center",
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

                //call function "fetchData"
                fetchData();

                // Reset form
                setSupplierId("");
                setImei("");
                setHandPhone("");
                setCatatan("");
                setHargaPembelian("");
                setSales("");
                setTanggalPembelian("");
                setJenisPembelian("");
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
                className="btn btn-primary d-sm-inline-block"
                data-bs-toggle="modal"
                data-bs-target="#modal-create-product"
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
                Add New
            </a>
            <div
                className="modal modal-blur fade"
                id="modal-create-product"
                tabIndex="-1"
                role="dialog"
                aria-hidden="true"
                ref={modalRef}
            >
                <div
                    className="modal-dialog modal-lg modal-dialog-centered"
                    role="document"
                >
                    <form onSubmit={storeBarangMasuk}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">New Product</h5>
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
                                            <label className="form-label">Supplier</label>
                                            <select
                                                className="form-select"
                                                value={supplierId}
                                                onChange={(e) => setSupplierId(e.target.value)}
                                            >
                                                <option value="">-- Select Supplier --</option>
                                                {supplier.map((sup) => (
                                                    <option value={sup.id} key={sup.id}>
                                                        {sup.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.supplier_id && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.supplier_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">IMEI</label>
                                            <div className="input-icon">
                                                <span className="input-icon-addon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></svg>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={imei}
                                                    onChange={(e) => setImei(e.target.value)}
                                                    placeholder="Scan IMEI"
                                                />
                                            </div>
                                            {errors.imei && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.imei}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Handphone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={handPhone}
                                                onChange={(e) => setHandPhone(e.target.value)}
                                                placeholder="Masukkan tipe handphone"
                                            />
                                            {errors.handphone_id && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.handphone_id}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Harga Pembelian</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                value={hargaPembelian}
                                                onChange={(e) => setHargaPembelian(e.target.value)}
                                            />
                                            {errors.harga_pembelian && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.harga_pembelian}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Sales</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={sales}
                                                onChange={(e) => setSales(e.target.value)}
                                            />
                                            {errors.sales && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.sales}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Tanggal Pembelian</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={tanggalPembelian}
                                                onChange={(e) => setTanggalPembelian(e.target.value)}
                                            />
                                            {errors.tanggal_pembelian && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.tanggal_pembelian}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="mb-3">
                                            <label className="form-label">Jenis Pembelian</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={jenisPembelian}
                                                onChange={(e) => setJenisPembelian(e.target.value)}
                                            />
                                            {errors.jenis_pembelian && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.jenis_pembelian}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Catatan</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={catatan}
                                                onChange={(e) => setCatatan(e.target.value)}
                                                placeholder="Tulis catatan pada barang"
                                            ></textarea>
                                            {errors.catatan_awal && (
                                                <div className="alert alert-danger mt-2">
                                                    {errors.catatan_awal}
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
                                    {/* {loading ? 'Proses menyimpan...' : 'Save'} */}
                                    SAVE
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}