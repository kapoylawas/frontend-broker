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

import CreateSupplier from "../../views/pembelian/components/createSupplier";
import CreateHP from "../../views/pembelian/components/createHandphone";

export default function PembelianCreate({ fetchDataSupplier, fetchDataHandPhone, fetchData }) {
  // state
  const [supplierId, setSupplierId] = useState("");
  const [handPhoneId, setHandPhoneId] = useState("");
  const [imei, setImei] = useState("");  
  const [kodeNegara, setKodeNegara] = useState();  
  const [hargaPembelian, setHargaPembelian] = useState("");
  const [sales, setSales] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [jenisPembelian, setJenisPembelian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [namaHandPhone, setNamaHandPhone] = useState("");
  const [errors, setErrors] = useState({});

  //state supplier
  const [supplier, setSupplier] = useState([]);
  // state hanphone
  const [handPhone, setHandPhone] = useState([]);

  //token
  const token = Cookies.get("token");

  const handleChangeImei = (e) => {
    const value = e.target.value;
    // Batasi input maksimal 8 karakter
    if (value.length <= 8) {
      setImei(value);
    }
  };

  //function "fetchSupplier"
  const fetchSupplier = async () => {
    //set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/supplier-all").then((response) => {
      //set data response to state "catgeories"
      setSupplier(response.data.data);
    });
  };

  //function "fetcHandPhone"
  const fetchHandPhone = async () => {
    //set authorization header with token
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/hand-phone").then((response) => {
      //set data response to state "catgeories"
      setHandPhone(response.data.data);
    });
  };

  //hook supplier
  useEffect(() => {
    //call function fetch supplier
    fetchSupplier();
  }, []);

  // hook handphone
  useEffect(() => {
    //call function fetch handphone
    fetchHandPhone();
  }, []);

  //function "storeProduct"
  const storeBarangMasuk = async (e) => {
    e.preventDefault();

    await Api.post("/api/barang-masuk", {
      //data
      supplier_id: supplierId,
      imei: imei,
      kode_negara: kodeNegara,
      handphone_id: handPhoneId,
      name_handphone: namaHandPhone,
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

        //call function "fetchData"
        fetchData();

        // Reset form
        resetForm();
      })
      .catch((error) => {
        //assign error to function "handleErrors"
        handleErrors(error.response.data, setErrors);
      });
  };

  //function to reset form
  const resetForm = () => {
    setSupplierId("");
    setImei("");
    setKodeNegara("");
    setHandPhoneId("");
    setNamaHandPhone("");
    setCatatan("");
    setHargaPembelian("");
    setSales("");
    setTanggalPembelian("");
    setJenisPembelian("");
    setErrors({});
  };

  // data untuk react select data supplier
  const supplierOptions = supplier.map((sup) => ({
    value: sup.id,
    label: `${sup.name} - ${sup.kode} - ${sup.no_hp}`,
  }));

  // data untuk react select data handphone
  const handPhoneOptions = Array.isArray(handPhone)
    ? handPhone.map((han) => ({
      value: han.id,
      label: `${han.name}`,
    }))
    : [];

 
  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CreateSupplier
            fetchDataSupplier={fetchDataSupplier}
            fetchSupplier={fetchSupplier}
          />
          <CreateHP
            fetchDataHandPhone={fetchDataHandPhone}
            fetchHandPhone={fetchHandPhone}
          />
          <form onSubmit={storeBarangMasuk}>
            <div className="modal-content mt-2">
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Supplier</label>
                      <Select
                        options={supplierOptions}
                        value={supplierOptions.find(
                          (option) => option.value === supplierId
                        )}
                        onChange={(selectedOption) =>
                          setSupplierId(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        placeholder="-- Select Supplier --"
                      />
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
                          value={imei}
                          onChange={handleChangeImei}
                          placeholder="Scan IMEI"
                          maxLength={8}
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
                      <label className="form-label">Kode Negara</label>
                      <div className="input-icon">
                        <input
                          type="text"
                          className="form-control"
                          value={kodeNegara}
                          onChange={(e) => setKodeNegara(e.target.value)}
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
                      <label className="form-label">Merk Handphone</label>
                      <Select
                        options={handPhoneOptions}
                        value={handPhoneOptions.find(
                          (option) => option.value === handPhoneId
                        )}
                        onChange={(selectedOption) =>
                          setHandPhoneId(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        placeholder="-- Select Hand-phone --"
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
                      <label className="form-label">Tipe Handphone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={namaHandPhone}
                        onChange={(e) => setNamaHandPhone(e.target.value)}
                      />
                      {errors.name_handphone && (
                        <div className="alert alert-danger mt-2">
                          {errors.name_handphone}
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
                  onClick={resetForm}
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
  );
}
