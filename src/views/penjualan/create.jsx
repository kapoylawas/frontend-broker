import { useState, useEffect } from "react";

//import js cookie
import Cookies from "js-cookie";

//import toats
import toast from "react-hot-toast";

//import service api
import Api from "../../services/api";

//import handler error
import { handleErrors } from "../../utils/handleErrors";

//import react select
import Select from "react-select";

export default function PenjualanCreate({ fetchData }) {

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <form>
                        <div className="modal-content mt-2">
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Data Barang</label>
                                            <Select

                                                placeholder="-- Select Supplier --"
                                            />

                                        </div>
                                    </div>

                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">IMEI</label>
                                            <div className="input-icon">
                                                <span className="input-icon-addon">
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
                                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                                        <path d="M21 21l-6 -6" />
                                                    </svg>
                                                </span>
                                                <input
                                                    type="text"
                                                    className="form-control"

                                                    placeholder="Scan IMEI"
                                                />
                                            </div>

                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Aksesoris</label>
                                            <Select

                                                placeholder="-- Select Aksesoris --"
                                            />

                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Metode Bayar</label>
                                            <Select

                                                placeholder="-- Select Aksesoris --"
                                            />

                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <label className="form-label">Catatan</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"

                                                placeholder="Tulis catatan pada barang"
                                            ></textarea>
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