// Import necessary modules and components
import React, { useEffect, useState } from 'react';
import LayoutAdmin from '../../layouts/admin';
//import react select
import Select from 'react-select'
//import js cookie
import Cookies from 'js-cookie';
//import service api
import Api from "../../services/api";

export default function Pembelian() {
    // State management for form inputs

    const [imei, setImei] = useState('');
    const [handPhone, setHandPhone] = useState('');
    const [hargaPembelian, setHargaPembelian] = useState('');
    const [tanggalPembelian, setTanggalPembelian] = useState('');
    const [sales, setSales] = useState('');
    const [jenisPembelian, setJenisPembelian] = useState('');
    const [catatan, setCatatan] = useState('');
    const [tipeBarang, setTipeBarang] = useState('');


    //state customers
    const [supplier, setSupplier] = useState([]);

    const [selectedCustomer, setSelectedCustomer] = useState('')

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({ supplier, tanggalPembelian, sales, jenisPembelian, catatan });
    };

    //function "fetchSupplier"
    const fetchSupplier = async () => {
        const token = Cookies.get('token');

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common['Authorization'] = token;

            await Api.get('/api/supplier-all')
                .then(response => {
                    //set data response to state "supplier"
                    setSupplier(response.data.data);
                });
        }
    }

    //hook useEffect
    useEffect(() => {
        fetchSupplier()
    }, [])

    // Function to handle form reset
    const handleReset = () => {
        setSupplier('');
        setTanggalPembelian('');
        setSales('');
        setJenisPembelian('');
        setCatatan('');
    };

    const customOptionRenderer = ({ innerProps, label }) => (
        <div {...innerProps} style={{ padding: '8px' }}>
            {label}
        </div>
    );

    const MenuList = (props) => {
        return (
            <div>
                {props.children}
                <div
                    style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#f0f0f0' }}
                    onClick={() => alert('Add New Supplier clicked!')}
                >
                    + Add New Supplier
                </div>
            </div>
        );
    };


    return (
        <LayoutAdmin>
            <div className="page-header d-print-none">
                <div className="container-xl">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <div className="page-pretitle">
                                HALAMAN
                            </div>
                            <h2 className="page-title">
                                PEMBELIAN
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-xl">
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="supplier" className="form-label">SUPPLIER</label>
                                <Select
                                    options={supplier}
                                    value={selectedCustomer}
                                    onChange={(e) => setSelectedCustomer(e)}
                                    getOptionLabel={(option) => `${option.name} - ${option.kode}`}
                                    components={{ Option: customOptionRenderer, MenuList }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="imei" className="form-label">IMEI</label>
                                <input
                                    placeholder='scan barcode'
                                    type="text"
                                    className="form-control"
                                    id="imei"
                                    value={imei}
                                    onChange={(e) => setImei(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="handphone" className="form-label">HANDPHONE</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="handphone"
                                    value={handPhone}
                                    onChange={(e) => setHandPhone(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">HARGA PEMBELIAN</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={hargaPembelian}
                                    onChange={(e) => setHargaPembelian(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="tanggalPembelian" className="form-label">TANGGAL PEMBELIAN</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tanggalPembelian"
                                    value={tanggalPembelian}
                                    onChange={(e) => setTanggalPembelian(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="sales" className="form-label">SALES</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="sales"
                                    value={sales}
                                    onChange={(e) => setSales(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="jenisPembelian" className="form-label">JENIS PEMBELIAN</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="jenisPembelian"
                                    value={jenisPembelian}
                                    onChange={(e) => setJenisPembelian(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="catatan" className="form-label">CATATAN</label>
                                <textarea
                                    className="form-control"
                                    id="catatan"
                                    rows="3"
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                ></textarea>
                            </div>
                            <button type="button" className="btn btn-secondary me-2" onClick={handleReset}>RESET</button>
                            <button type="submit" className="btn btn-primary">SAVE</button>
                        </form>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    );
}
