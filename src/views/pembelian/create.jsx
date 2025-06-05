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
import { all } from "axios";

export default function PembelianCreate({
  fetchDataSupplier,
  fetchDataHandPhone,
  fetchData,
}) {
  // state
  const [supplierId, setSupplierId] = useState("");
  const [handPhoneId, setHandPhoneId] = useState("");
  const [kapasitas, setKapasitas] = useState();
  const [hargaPembelian, setHargaPembelian] = useState("");
  const [sales, setSales] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [jenisPembelian, setJenisPembelian] = useState("");
  const [catatan, setCatatan] = useState("");

  const [imei, setImei] = useState("");
  const [selectImeiId, setSelectImeiId] = useState("");
  const [suggestionsImei, setSuggestionsImei] = useState([]);
  const [allImei, setAllImei] = useState([]);

  const [kodeNegara, setKodeNegara] = useState();
  const [selectKodeNegaraId, setSelectKodeNegaraId] = useState("");
  const [suggestionsKodeNegara, setSuggestionsKodeNegara] = useState([]);
  const [allKodeNegara, setAllKodeNegara] = useState([]);

  const [warna, setWarna] = useState();
  const [selectWarnaId, setSelectWarnaId] = useState("");
  const [suggestionsWarna, setSuggestionsWarna] = useState([]);
  const [allWarna, setAllWarna] = useState([]);

  const [namaHandPhone, setNamaHandPhone] = useState("");
  const [selectedHandphoneId, setSelectedHandphoneId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allHandphones, setAllHandphones] = useState([]); // Menyimpan semua handphone

  const [errors, setErrors] = useState({});

  //state supplier
  const [supplier, setSupplier] = useState([]);
  // state hanphone
  const [handPhone, setHandPhone] = useState([]);

  //token
  const token = Cookies.get("token");

  {/* sugest warna */ }
  useEffect(() => {
    const fetchWarna = async () => {
      try {
        if (!token) {
          console.error("Token tidak tersedia");
          return;
        }

        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get("/api/warna");

        if (response.data && Array.isArray(response.data.data)) {
          const uniqueWarna = response.data.data.reduce((acc, current) => {
            if (!current || !current.name) return acc;

            const existing = acc.find(item =>
              item && item.name && current.name &&
              item.name.trim().toLowerCase() === current.name.trim().toLowerCase()
            );
            return existing ? acc : [...acc, current];
          }, []);

          setAllWarna(uniqueWarna);
        } else {
          console.error("Data Warna tidak valid:", response.data);
        }
      } catch (error) {
        console.error("Error fetching Warna:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
      }
    };

    fetchWarna();
  }, [token]);

  const handleChangeWarna = (e) => {
    const value = e.target.value;
    setWarna(value);

    // Hanya reset selectedWarnaID jika input berbeda dengan yang terpilih
    if (
      selectWarnaId &&
      !allWarna.some(
        (item) => item && item.id === selectWarnaId && item.name === value
      )
    ) {
      setSelectWarnaId(null);
    }

    // Cari exact match terlebih dahulu
    const exactMatch = allWarna.find(
      (item) => item && item.name && item.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (exactMatch) {
      setSuggestionsWarna([exactMatch]);
    } else {
      // Jika tidak ada exact match, cari partial match
      const filteredSuggestionsWarna = allWarna.filter((item) =>
        item && item.name && item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionsWarna(filteredSuggestionsWarna);
    }
  };

  const handleSuggestionClickWarna = (id, name) => {
    if (name) {
      setWarna(name);
      setSelectWarnaId(id);
      setSuggestionsWarna([]);
    }
  };

  const addNewWarna = async (name) => {
    try {
      // Normalisasi nama untuk pengecekan (trim dan lowercase)
      const normalizedInput = name.trim().toLowerCase();

      // Cek duplikat di data lokal sebelum mengirim ke API
      const isDuplicate = allWarna.some(
        (item) => item.name.trim().toLowerCase() === normalizedInput
      );

      if (isDuplicate) {
        throw new Error("Tipe warna ini sudah terdaftar");
      }

      Api.defaults.headers.common["Authorization"] = token;
      const response = await Api.post("/api/warna", { name });
      return response.data.data;
    } catch (error) {
      console.error("Error adding new warna type:", error);
      throw error;
    }
  };

  const handleWarnaTypeSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = warna.trim();
    if (!trimmedName) return;

    // Cek exact match
    const exactMatch = allWarna.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exactMatch) {
      setSelectKodeNegaraId(exactMatch.id);
      setKodeNegara(exactMatch.name);
      toast.success(`Menggunakan tipe yang sudah ada: ${exactMatch.name}`);
      return;
    }

    // Jika tidak ada exact match, lanjutkan penambahan baru
    try {
      const newWarna = await addNewWarna(trimmedName);
      setAllWarna([...allWarna, newWarna]);
      setSelectWarnaId(newWarna.id);
      setWarna(newWarna.name);
      toast.success("Warna berhasil ditambahkan!");
    } catch (error) {
      // Handle error
    }
  };
  {/* sugest end warna */ }

  {/* sugest type kode negara */ }
  useEffect(() => {
    const fetchKodeNegara = async () => {
      try {
        if (!token) {
          console.error("Token tidak tersedia");
          return;
        }

        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get("/api/kode-negara");

        if (response.data && Array.isArray(response.data.data)) {
          const uniqueKodeNegara = response.data.data.reduce((acc, current) => {
            if (!current || !current.name) return acc;

            const existing = acc.find(item =>
              item && item.name && current.name &&
              item.name.trim().toLowerCase() === current.name.trim().toLowerCase()
            );
            return existing ? acc : [...acc, current];
          }, []);

          setAllKodeNegara(uniqueKodeNegara);
        } else {
          console.error("Data Kode Negara tidak valid:", response.data);
        }
      } catch (error) {
        console.error("Error fetching kode negara:", error);
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
      }
    };

    fetchKodeNegara();
  }, [token]);

  const handleChangeKodeNegara = (e) => {
    const value = e.target.value;
    setKodeNegara(value);

    // Hanya reset selectedKodenegaraID jika input berbeda dengan yang terpilih
    if (
      selectKodeNegaraId &&
      !allKodeNegara.some(
        (item) => item && item.id === selectKodeNegaraId && item.name === value
      )
    ) {
      setSelectKodeNegaraId(null);
    }

    // Cari exact match terlebih dahulu
    const exactMatch = allKodeNegara.find(
      (item) => item && item.name && item.name.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (exactMatch) {
      setSuggestionsKodeNegara([exactMatch]);
    } else {
      // Jika tidak ada exact match, cari partial match
      const filteredSuggestionsKodeNegara = allKodeNegara.filter((item) =>
        item && item.name && item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionsKodeNegara(filteredSuggestionsKodeNegara);
    }
  };

  const handleSuggestionClickKodeNegara = (id, name) => {
    if (name) {
      setKodeNegara(name);
      setSelectKodeNegaraId(id);
      setSuggestionsKodeNegara([]);
    }
  };

  const addNewKodeNegara = async (name) => {
    try {
      // Normalisasi nama untuk pengecekan (trim dan lowercase)
      const normalizedInput = name.trim().toLowerCase();

      // Cek duplikat di data lokal sebelum mengirim ke API
      const isDuplicate = allKodeNegara.some(
        (item) => item.name.trim().toLowerCase() === normalizedInput
      );

      if (isDuplicate) {
        throw new Error("Tipe kode negara ini sudah terdaftar");
      }

      Api.defaults.headers.common["Authorization"] = token;
      const response = await Api.post("/api/kode-negara", { name });
      return response.data.data;
    } catch (error) {
      console.error("Error adding new kode negara type:", error);
      throw error;
    }
  };

  const handleKodeNegaraTypeSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = kodeNegara.trim();
    if (!trimmedName) return;

    // Cek exact match
    const exactMatch = allKodeNegara.find(
      (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exactMatch) {
      setSelectKodeNegaraId(exactMatch.id);
      setKodeNegara(exactMatch.name);
      toast.success(`Menggunakan tipe yang sudah ada: ${exactMatch.name}`);
      return;
    }

    // Jika tidak ada exact match, lanjutkan penambahan baru
    try {
      const newKodeNegara = await addNewKodeNegara(trimmedName);
      setAllKodeNegara([...allKodeNegara, newKodeNegara]);
      setSelectKodeNegaraId(newKodeNegara.id);
      setKodeNegara(newKodeNegara.name);
      toast.success("Kode Negara berhasil ditambahkan!");
    } catch (error) {
      // Handle error
    }
  };
  {/* end type kode negara */ }

  {/* sugest type imei */ }
  useEffect(() => {
    const fetchImei = async () => {
      try {
        // Pastikan token tersedia
        if (!token) {
          console.error("Token tidak tersedia");
          return;
        }

        Api.defaults.headers.common["Authorization"] = token;
        const response = await Api.get("/api/imei");

        // Pastikan response.data.data ada dan merupakan array
        if (response.data && Array.isArray(response.data.data)) {
          const uniqueImei = response.data.data.reduce((acc, current) => {
            // Tambahkan pengecekan jika current atau current.imei tidak ada
            if (!current || !current.imei) return acc;

            const existing = acc.find(item =>
              item.imei && current.imei &&
              item.imei.trim().toLowerCase() === current.imei.trim().toLowerCase()
            );
            return existing ? acc : [...acc, current];
          }, []);

          setAllImei(uniqueImei);
        } else {
          console.error("Data IMEI tidak valid:", response.data);
        }
      } catch (error) {
        console.error("Error fetching imei:", error);
        // Tambahkan penanganan error lebih baik
        if (error.response) {
          console.error("Response error:", error.response.data);
        }
      }
    };

    fetchImei();
  }, [token]);

  const handleChangeImei = (e) => {
    const value = e.target.value;
    setImei(value);

    // Hanya reset selectedImeiId jika input berbeda dengan yang terpilih
    if (
      selectImeiId &&
      !allImei.some(
        (item) => item.id === selectImeiId && item.imei === value
      )
    ) {
      setSelectImeiId(null);
    }

    // Cari exact match terlebih dahulu
    const exactMatch = allImei.find(
      (item) => item.imei.trim().toLowerCase() === value.trim().toLowerCase()
    );

    if (exactMatch) {
      setSuggestionsImei([exactMatch]);
    } else {
      // Jika tidak ada exact match, cari partial match
      const filteredSuggestionsImei = allImei.filter((item) =>
        item.imei.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestionsImei(filteredSuggestionsImei);
    }
  };

  const handleSuggestionClickImei = (id, imei) => {
    setImei(imei);
    setSelectImeiId(id);
    setSuggestionsImei([]); // Hapus saran setelah pemilihan
  };

  const addNewImei = async (imei) => {
    try {
      // Normalisasi nama untuk pengecekan (trim dan lowercase)
      const normalizedInput = imei.trim().toLowerCase();

      // Cek duplikat di data lokal sebelum mengirim ke API
      const isDuplicate = allImei.some(
        (item) => item.imei.trim().toLowerCase() === normalizedInput
      );

      if (isDuplicate) {
        throw new Error("Tipe imei ini sudah terdaftar");
      }

      Api.defaults.headers.common["Authorization"] = token;
      const response = await Api.post("/api/imei", { imei });
      return response.data.data;
    } catch (error) {
      console.error("Error adding new handphone type:", error);
      throw error;
    }
  };

  const handleImeiTypeSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = imei.trim();
    if (!trimmedName) return;

    // Cek exact match
    const exactMatch = allImei.find(
      (item) => item.imei.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (exactMatch) {
      setSelectImeiId(exactMatch.id);
      setImei(exactMatch.imei);
      toast.success(`Menggunakan tipe yang sudah ada: ${exactMatch.imei}`);
      return;
    }

    // Jika tidak ada exact match, lanjutkan penambahan baru
    try {
      const newImei = await addNewImei(trimmedName);
      setAllImei([...allImei, newImei]);
      setSelectImeiId(newImei.id);
      setImei(newImei.imei);
      toast.success("Imei berhasil ditambahkan!");
    } catch (error) {
      // Handle error
    }
  };
  {/* end sugest type imei */ }

  {/* sugest type tipe handphone */ }
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
  {/* end sugest type handphone */ }


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
      imei_id: selectImeiId,
      kodenegara_id: selectKodeNegaraId,
      warna_id: selectWarnaId,
      kapasitas_id: 1,
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

  const handleKeyDownImei = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleImeiTypeSubmit(e);
    }
  };

  const handleKeyDownKodeNegara = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleKodeNegaraTypeSubmit(e);
    }
  };

  const handleKeyDownWarna = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleWarnaTypeSubmit(e);
    }
  };

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
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errors.imei_type ? "is-invalid" : ""}`}
                          value={imei}
                          onChange={(e) => {
                            // Batasi input maksimal 8 karakter
                            const value = e.target.value;
                            if (value.length <= 8) {
                              setImei(value);
                              handleChangeImei(e); // Tetap jalankan handleChangeImei untuk suggestions
                            }
                          }}
                          maxLength={8}
                          onBlur={handleImeiTypeSubmit}
                          onKeyDown={handleKeyDownImei}
                          placeholder="Ketik atau pilih imei"
                        />
                        {!selectImeiId && imei.trim() && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleImeiTypeSubmit}
                            disabled={suggestionsImei.some(
                              (item) =>
                                item.imei.trim().toLowerCase() ===
                                imei.trim().toLowerCase()
                            )}
                          >
                            {suggestionsImei.some(
                              (item) =>
                                item.imei.trim().toLowerCase() ===
                                imei.trim().toLowerCase()
                            )
                              ? "Data sudah ada"
                              : "Tambah Baru"}
                          </button>
                        )}
                      </div>

                      {errors.imei && (
                        <div className="alert alert-danger mt-2">
                          {errors.imei}
                        </div>
                      )}

                      {imei && suggestionsImei.length > 0 && (
                        <div className="mt-2">
                          <div className="text-muted small mb-1">
                            Pilih dari daftar:
                          </div>
                          <ul className="list-group">
                            {suggestionsImei.map((item) => (
                              <li
                                key={item.id}
                                className="list-group-item list-group-item-action"
                                onClick={() =>
                                  handleSuggestionClickImei(item.id, item.imei)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {item.imei}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {imei &&
                        suggestionsImei.length === 0 &&
                        allImei.length > 0 && (
                          <div className="text-muted mt-1">
                            {selectImeiId
                              ? `Menggunakan tipe: ${imei}`
                              : "Tekan Enter untuk menambahkan tipe baru"}
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Kode Negara</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errors.name_type ? "is-invalid" : ""}`}
                          value={kodeNegara || ''}  // Fallback to empty string if undefined
                          onChange={handleChangeKodeNegara}
                          maxLength={8}
                          onBlur={handleKodeNegaraTypeSubmit}
                          onKeyDown={handleKeyDownKodeNegara}
                          placeholder="Ketik atau pilih kode negara"
                        />
                        {!selectKodeNegaraId && kodeNegara?.trim() && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleKodeNegaraTypeSubmit}
                            disabled={suggestionsKodeNegara.some(
                              (item) => item?.name?.trim().toLowerCase() === kodeNegara.trim().toLowerCase()
                            )}
                          >
                            {suggestionsKodeNegara.some(
                              (item) => item?.name?.trim().toLowerCase() === kodeNegara.trim().toLowerCase()
                            )
                              ? "Data sudah ada"
                              : "Tambah Baru"}
                          </button>
                        )}
                      </div>

                      {errors.kode_negara && (
                        <div className="alert alert-danger mt-2">
                          {errors.kode_negara}
                        </div>
                      )}

                      {kodeNegara && suggestionsKodeNegara?.length > 0 && (
                        <div className="mt-2">
                          <div className="text-muted small mb-1">
                            Pilih dari daftar:
                          </div>
                          <ul className="list-group">
                            {suggestionsKodeNegara.map((item) => (
                              <li
                                key={item?.id}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSuggestionClickKodeNegara(item?.id, item?.name)}
                                style={{ cursor: "pointer" }}
                              >
                                {item?.name || 'Unknown'}
                              </li>
                            ))}
                          </ul>
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
                          className={`form-control ${errors.handphone_type ? "is-invalid" : ""
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
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${errors.warna_type ? "is-invalid" : ""
                            }`}
                          value={warna}
                          onChange={handleChangeWarna}
                          onBlur={handleWarnaTypeSubmit}
                          onKeyDown={handleKeyDownWarna}
                          placeholder="Ketik atau pilih warna"
                        />
                        {!selectWarnaId && warna?.trim() && (
                          <button
                            className="btn btn-primary"
                            type="button"
                            onClick={handleWarnaTypeSubmit}
                            disabled={suggestionsWarna.some(
                              (item) =>
                                item?.name?.trim().toLowerCase() ===
                                warna.trim().toLowerCase()
                            )}
                          >
                            {suggestionsWarna.some(
                              (item) =>
                                item?.name?.trim().toLowerCase() ===
                                warna.trim().toLowerCase()
                            )
                              ? "Data sudah ada"
                              : "Tambah Baru"}
                          </button>
                        )}
                      </div>

                      {errors.warna && (
                        <div className="alert alert-danger mt-2">
                          {errors.warna}
                        </div>
                      )}

                      {warna && suggestionsWarna.length > 0 && (
                        <div className="mt-2">
                          <div className="text-muted small mb-1">
                            Pilih dari daftar:
                          </div>
                          <ul className="list-group">
                            {suggestionsWarna.map((item) => (
                              <li
                                key={item.id}
                                className="list-group-item list-group-item-action"
                                onClick={() =>
                                  handleSuggestionClickWarna(item.id, item.name)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {warna &&
                        suggestionsWarna.length === 0 &&
                        allWarna.length > 0 && (
                          <div className="text-muted mt-1">
                            {selectWarnaId
                              ? `Menggunakan tipe: ${warna}`
                              : "Tekan Enter untuk menambahkan tipe baru"}
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
          </form >
        </div >
      </div >
    </>
  );
}
