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

export default function PembelianCreate({
  fetchDataSupplier,
  fetchDataHandPhone,
  fetchData,
}) {
  // state
  const [supplierId, setSupplierId] = useState("");
  const [handPhoneId, setHandPhoneId] = useState("");
  const [imei, setImei] = useState("");
  const [kodeNegara, setKodeNegara] = useState();
  const [warna, setWarna] = useState();
  const [kapasitas, setKapasitas] = useState();
  const [hargaPembelian, setHargaPembelian] = useState("");
  const [sales, setSales] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [jenisPembelian, setJenisPembelian] = useState("");
  const [catatan, setCatatan] = useState("");
  const [namaHandPhone, setNamaHandPhone] = useState("");
  const [selectedHandphoneId, setSelectedHandphoneId] = useState("");
  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [allHandphones, setAllHandphones] = useState([]); // Menyimpan semua handphone

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

  useEffect(() => {
    const fetchHandphones = async () => {
      try {
        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get("/api/tipe-hand-phone");

        // Normalisasi data (hapus duplikat berdasarkan nama)
        const uniqueHandphones = response.data.data.reduce((acc, current) => {
          const x = acc.find(
            (item) =>
              item.name.trim().toLowerCase() ===
              current.name.trim().toLowerCase()
          );
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);

        setAllHandphones(uniqueHandphones);
      } catch (error) {
        console.error("Error fetching handphones:", error);
      }
    };

    fetchHandphones();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setNamaHandPhone(value);

    // Hanya reset selectedHandphoneId jika input berbeda dengan yang terpilih
    if (
      selectedHandphoneId &&
      !allHandphones.some(
        (item) => item.id === selectedHandphoneId && item.name === value
      )
    ) {
      setSelectedHandphoneId(null);
    }

    // Cari exact match terlebih dahulu
    const exactMatch = allHandphones.find(
      (item) => item.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (exactMatch) {
      setSuggestions([exactMatch]);
    } else {
      // Jika tidak ada exact match, cari partial match
      const filteredSuggestions = allHandphones.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (id, name) => {
    setNamaHandPhone(name);
    setSelectedHandphoneId(id);
    setSuggestions([]); // Hapus saran setelah pemilihan
  };

  const addNewHandphoneType = async (name) => {
    try {
      // Normalisasi nama untuk pengecekan (trim dan lowercase)
      const normalizedInput = name.trim().toLowerCase();

      // Cek duplikat di data lokal sebelum mengirim ke API
      const isDuplicate = allHandphones.some(
        (item) => item.name.trim().toLowerCase() === normalizedInput
      );

      if (isDuplicate) {
        throw new Error("Tipe handphone ini sudah terdaftar");
      }

      Api.defaults.headers.common["Authorization"] = token;
      const response = await Api.post("/api/tipe-hand-phone", { name });
      return response.data.data;
    } catch (error) {
      console.error("Error adding new handphone type:", error);
      throw error;
    }
  };

  const handleHandphoneTypeSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = namaHandPhone.trim();
    if (!trimmedName) return;

    // Cek exact match
    const exactMatch = allHandphones.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exactMatch) {
      setSelectedHandphoneId(exactMatch.id);
      setNamaHandPhone(exactMatch.name);
      toast.success(`Menggunakan tipe yang sudah ada: ${exactMatch.name}`);
      return;
    }

    // Jika tidak ada exact match, lanjutkan penambahan baru
    try {
      const newHandphone = await addNewHandphoneType(trimmedName);
      setAllHandphones([...allHandphones, newHandphone]);
      setSelectedHandphoneId(newHandphone.id);
      setNamaHandPhone(newHandphone.name);
      toast.success("Tipe handphone berhasil ditambahkan!");
    } catch (error) {
      // Handle error
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
      warna: warna,
      kapasitas: kapasitas,
      handphone_id: handPhoneId,
      namehandphone_id: selectedHandphoneId,
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
    setWarna("");
    setKapasitas("");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleHandphoneTypeSubmit(e);
    }
  };

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
                          placeholder="Kode Negara"
                        />
                      </div>
                      {errors.kode_negara && (
                        <div className="alert alert-danger mt-2">
                          {errors.kode_negara}
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
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${
                            errors.handphone_type ? "is-invalid" : ""
                          }`}
                          value={namaHandPhone}
                          onChange={handleChange}
                          onBlur={handleHandphoneTypeSubmit}
                          onKeyDown={handleKeyDown}
                          placeholder="Ketik atau pilih tipe handphone"
                        />
                        {!selectedHandphoneId && namaHandPhone.trim() && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleHandphoneTypeSubmit}
                            disabled={suggestions.some(
                              (item) =>
                                item.name.trim().toLowerCase() ===
                                namaHandPhone.trim().toLowerCase()
                            )}
                          >
                            {suggestions.some(
                              (item) =>
                                item.name.trim().toLowerCase() ===
                                namaHandPhone.trim().toLowerCase()
                            )
                              ? "Data sudah ada"
                              : "Tambah Baru"}
                          </button>
                        )}
                      </div>

                      {errors.handphone_type && (
                        <div className="alert alert-danger mt-2">
                          {errors.handphone_type}
                        </div>
                      )}

                      {namaHandPhone && suggestions.length > 0 && (
                        <div className="mt-2">
                          <div className="text-muted small mb-1">
                            Pilih dari daftar:
                          </div>
                          <ul className="list-group">
                            {suggestions.map((item) => (
                              <li
                                key={item.id}
                                className="list-group-item list-group-item-action"
                                onClick={() =>
                                  handleSuggestionClick(item.id, item.name)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {namaHandPhone &&
                        suggestions.length === 0 &&
                        allHandphones.length > 0 && (
                          <div className="text-muted mt-1">
                            {selectedHandphoneId
                              ? `Menggunakan tipe: ${namaHandPhone}`
                              : "Tekan Enter untuk menambahkan tipe baru"}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Warna</label>
                      <input
                        type="text"
                        className="form-control"
                        value={warna}
                        onChange={(e) => setWarna(e.target.value)}
                      />
                      {errors.warna && (
                        <div className="alert alert-danger mt-2">
                          {errors.warna}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Kapasitas</label>
                      <input
                        type="text"
                        className="form-control"
                        value={kapasitas}
                        onChange={(e) => setKapasitas(e.target.value)}
                      />
                      {errors.kapasitas && (
                        <div className="alert alert-danger mt-2">
                          {errors.kapasitas}
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
