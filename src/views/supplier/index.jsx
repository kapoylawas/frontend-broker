//import layout admin
import { useState, useEffect } from "react";
import LayoutAdmin from "../../layouts/admin";
import Cookies from "js-cookie";
import Api from "../../services/api";
import Skeleton from "react-loading-skeleton"; // Import Skeleton
import "react-loading-skeleton/dist/skeleton.css";

export default function Supplier() {

    //state supplier
    const [supplier, setSupplier] = useState([]);
    const [loading, setLoading] = useState(false); // Loading state

    //token
    const token = Cookies.get("token");

    //function "fetchSupplier"
    const fetchSupplier = async () => {
        //set authorization header with token
        Api.defaults.headers.common["Authorization"] = token;
        await Api.get("/api/supplier-all").then((response) => {
            //set data response to state "catgeories"
            setSupplier(response.data.data);
        });
    }


    //hook supplier
    useEffect(() => {
        //call function fetch supplier
        fetchSupplier();
    }, []);

    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">HALAMAN</div>
                            <h2 className="page-title">Supplier</h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="search by supplier name"
                                />
                                <button
                                    className="btn btn-md btn-primary"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">

                                    <table className="table table-vcenter table-mobile-md card-table">
                                        <thead>
                                            <tr>
                                                <th>Kode</th>
                                                <th>Name</th>
                                                <th>No hp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {supplier.length > 0 ? (
                                                supplier.map((sp, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            className="text-muted"
                                                            data-label="Description"
                                                        >
                                                            {sp.kode}
                                                        </td>
                                                        <td
                                                            className="text-muted"
                                                            data-label="Description"
                                                        >
                                                            {sp.name}
                                                        </td>
                                                        <td
                                                            className="text-muted"
                                                            data-label="Description"
                                                        >
                                                            {sp.no_hp}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center">
                                                        <div className="alert alert-danger mb-0">
                                                            Data Belum Tersedia!
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}