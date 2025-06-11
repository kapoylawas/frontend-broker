import { Link, useParams } from "react-router-dom";
import LayoutAdmin from "../../layouts/admin";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Cookies from "js-cookie";
import Api from "../../services/api";
import { useEffect, useState } from "react";
import moneyFormat from "../../utils/moneyFormat";
import Select from "react-select";
import toast from "react-hot-toast";
import { handleErrors } from "../../utils/handleErrors";

export default function ShowBarang() {
  const { id } = useParams();
  const token = Cookies.get("token");

  // const [dataBarang, setDataBarang] = useState({});
  const [dataSupplier, setDataSupplier] = useState({});
  const [dataHandPhone, setDataHandPhone] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [imeiId, setImeiId] = useState("");

  const [kodeNegaraId, setKodeNegaraId] = useState("");
  const [tipeHandPhoneId, setTipeHandPhoneId] = useState("");
  const [warnaId, setWarnaId] = useState("");
  const [kapasitasId, setKapasitasId] = useState("");
  const [namaHandPhone, setNamaHandPhone] = useState("");
  const [tipeHandPhone, setTipeHandPhone] = useState("");
  const [kodeNegara, setKodeNegara] = useState("");
  const [warna, setWarna] = useState("");
  const [kapasitas, setKapasitas] = useState("");


  const [barcode, setBarcode] = useState("");

  const [handPhoneId, setHandPhoneId] = useState("");
  const [imei, setImei] = useState("");
  const [jenisPembelian, setJenisPembelian] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [qualityControl, setQualityControl] = useState("");
  const [unit, setUnit] = useState("");
  const [catatanAwal, setCatatanAwal] = useState("");
  const [catatanSelesai, setCatatanSelesai] = useState("");
  const [hargaPembelian, setHargaPembelian] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [handPhone, setHandPhone] = useState([]);
  const [dataTipeHanphone, setDataTipeHanphone] = useState([]);
  const [dataKodeNegara, setDatakodeNegara] = useState([]);
  const [dataWarna, setDataWarna] = useState([]);
  const [dataKapasitas, setDataKapasitas] = useState([]);


  const fetchSupplier = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/supplier-all").then((response) => {
      setSupplier(response.data.data);
    });
  };

  const fetchHandPhone = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/hand-phone").then((response) => {
      setHandPhone(response.data.data);
    });
  };

  const fetchTipeHandPhone = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/tipe-hand-phone").then((response) => {
      setDataTipeHanphone(response.data.data);
    });
  };

  const fetchKodeNegara = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/kode-negara").then((response) => {
      setDatakodeNegara(response.data.data);
    });
  };

  const fetchWarna = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/warna").then((response) => {
      setDataWarna(response.data.data);
    });
  };

  const fetchKapasitas = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/kapasitas").then((response) => {
      setDataKapasitas(response.data.data);
    });
  };

  const fetchBarangMasuk = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get(`/api/barang-masuk/${id}`).then((response) => {

      // setDataBarang(response.data.data);
      setDataSupplier(response.data.data.supplier);
      setDataHandPhone(response.data.data.handphone);
      setImei(response.data.data.imei.imei);
      setBarcode(response.data.data.imei.barcode);
      setJenisPembelian(response.data.data.jenis_pembelian);
      setTanggalPembelian(response.data.data.tanggal_pembelian);
      setCatatanAwal(response.data.data.catatan_awal);
      setCatatanSelesai(response.data.data.catatan_selesai);
      setHargaPembelian(response.data.data.harga_pembelian);
      setSupplierId(response.data.data.supplier.id);
      setHandPhoneId(response.data.data.handphone.id);
      setNamaHandPhone(response.data.data.handphone.name);
      setTipeHandPhone(response.data.data.tipe_handphone.name)
      setQualityControl(response.data.data.quality_control)
      setUnit(response.data.data.unit)
      setKodeNegara(response.data.data.kode_negara.name)
      setWarna(response.data.data.warna.name)
      setKapasitas(response.data.data.kapasitas.name)

      setImeiId(response.data.data.imei.id)
      setKodeNegaraId(response.data.data.kode_negara.id)
      setTipeHandPhoneId(response.data.data.tipe_handphone.id)
      setWarnaId(response.data.data.warna.id)
      setKapasitasId(response.data.data.kapasitas.id)
    });
  };

  useEffect(() => {
    fetchBarangMasuk();
    fetchSupplier();
    fetchHandPhone();
    fetchTipeHandPhone();
    fetchKodeNegara();
    fetchWarna();
    fetchKapasitas();
  }, []);

  const supplierOptions = supplier.map((sup) => ({
    value: sup.id,
    label: `${sup.name} - ${sup.kode} - ${sup.no_hp}`,
  }));

  const handPhoneOptions = Array.isArray(handPhone)
    ? handPhone.map((han) => ({
      value: han.id,
      label: `${han.name}`,
    }))
    : [];

  const handTipePhoneOptions = Array.isArray(dataTipeHanphone)
    ? dataTipeHanphone.map((tipe) => ({
      value: tipe.id,
      label: `${tipe.name}`,
    }))
    : [];

  const handKodeNegaraOptions = Array.isArray(dataKodeNegara)
    ? dataKodeNegara.map((kode) => ({
      value: kode.id,
      label: `${kode.name}`,
    }))
    : [];

  const handWarnaOptions = Array.isArray(dataWarna)
    ? dataWarna.map((warna) => ({
      value: warna.id,
      label: `${warna.name}`,
    }))
    : [];

  const handKapasitasOptions = Array.isArray(dataKapasitas)
    ? dataKapasitas.map((kps) => ({
      value: kps.id,
      label: `${kps.name}`,
    }))
    : [];

  const handleEditToggle = async () => {
    if (isEditing) {
      await updateBarangMasuk();
    }
    setIsEditing(!isEditing);
  };

  const updateBarangMasuk = async () => {
    const payload = {
      supplier_id: supplierId,
      handphone_id: handPhoneId,
      imei_id: imeiId,
      kodenegara_id: kodeNegaraId,
      warna_id: warnaId,
      kapasitas_id: kapasitasId,
      namehandphone_id: tipeHandPhoneId,
      harga_pembelian: hargaPembelian,
      quality_control: qualityControl,
      unit: unit,
      tanggal_pembelian: tanggalPembelian,
      jenis_pembelian: jenisPembelian,
      catatan_awal: catatanAwal,
      catatan_selesai: catatanSelesai,
    };

    try {
      const response = await Api.put(`/api/barang-masuk/${id}`, payload);
      toast.success(`${response.data.meta.message}`, {
        duration: 5000,
        position: "top-center",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      fetchBarangMasuk(); // Refresh data after update
    } catch (error) {
      handleErrors(error.response.data);
    }
  };

  return (
    <LayoutAdmin>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <div className="page-pretitle">HALAMAN DETAIL BARANG</div>
              <Tabs>
                <TabList>
                  <Tab>BAYAR</Tab>
                  <Tab>CETAK BARCODE</Tab>
                </TabList>

                <TabPanel>
                  <div className="page-body">
                    <div className="container-xl">
                      <div className="card">
                        <div className="card-body">
                          <table className="table table-vcenter card-table">
                            <tbody>
                              <tr>
                                <th>Number Barcode</th>
                                <td>{barcode}</td>
                              </tr>
                              <tr>
                                <th>Supplier</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={supplierOptions}
                                      value={supplierOptions.find(
                                        (option) => option.value === supplierId
                                      )}
                                      onChange={(selectedOption) =>
                                        setSupplierId(
                                          selectedOption
                                            ? selectedOption.value
                                            : ""
                                        )
                                      }
                                      placeholder="-- Select Supplier --"
                                    />
                                  ) : (
                                    <b>
                                      {dataSupplier.name} - {dataSupplier.kode}
                                    </b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Merek Handphone</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handPhoneOptions}
                                      value={handPhoneOptions.find(
                                        (option) => option.value === handPhoneId
                                      )}
                                      onChange={(selectedOption) => {
                                        setHandPhoneId(selectedOption ? selectedOption.value : "");
                                        setNamaHandPhone(selectedOption ? selectedOption.label : "");
                                      }}
                                      placeholder="-- Select Handphone --"
                                    />
                                  ) : (
                                    <b>{dataHandPhone?.name || namaHandPhone}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Tipe Handphone</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handTipePhoneOptions}
                                      value={handTipePhoneOptions.find(
                                        (option) => option.value === tipeHandPhoneId
                                      )}
                                      onChange={(selectedOption) => {
                                        setTipeHandPhoneId(selectedOption ? selectedOption.value : "");
                                        setTipeHandPhone(selectedOption ? selectedOption.label : "");
                                      }}
                                      placeholder="-- Select Tipe Handphone --"
                                    />
                                  ) : (
                                    <b>{dataTipeHanphone?.type || tipeHandPhone}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Kode Negara</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handKodeNegaraOptions}
                                      value={handKodeNegaraOptions.find(
                                        (option) => option.value === kodeNegaraId
                                      )}
                                      onChange={(selectedOption) => {
                                        setKodeNegaraId(selectedOption ? selectedOption.value : "");
                                        setKodeNegara(selectedOption ? selectedOption.label : "");
                                      }}
                                      placeholder="-- Select Kode Negara --"
                                    />
                                  ) : (
                                    <b>{kodeNegara}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Warna</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handWarnaOptions}
                                      value={handWarnaOptions.find(
                                        (option) => option.value === warnaId
                                      )}
                                      onChange={(selectedOption) => {
                                        setWarnaId(selectedOption ? selectedOption.value : "");
                                        setWarna(selectedOption ? selectedOption.label : "");
                                      }}
                                      placeholder="-- Select Warna --"
                                    />
                                  ) : (
                                    <b>{warna}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Kapasitas</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handKapasitasOptions}
                                      value={handKapasitasOptions.find(
                                        (option) => option.value === kapasitasId
                                      )}
                                      onChange={(selectedOption) => {
                                        setKapasitasId(selectedOption ? selectedOption.value : "");
                                        setKapasitas(selectedOption ? selectedOption.label : "");
                                      }}
                                      placeholder="-- Select Kapasitas --"
                                    />
                                  ) : (
                                    <b>{kapasitas}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>IMEI</th>
                                <td>
                                  <b>{imei}</b>
                                </td>
                              </tr>
                              <tr>
                                <th>Jenis Pembelian</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={jenisPembelian}
                                      onChange={(e) =>
                                        setJenisPembelian(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>{jenisPembelian}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Tanggal Pembelian</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="date"
                                      className="form-control"
                                      value={tanggalPembelian.split("T")[0]}
                                      onChange={(e) =>
                                        setTanggalPembelian(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>
                                      {tanggalPembelian
                                        ? tanggalPembelian.split("T")[0]
                                        : "Tanggal tidak tersedia"}
                                    </b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Quality Control</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={qualityControl}
                                      onChange={(e) => setQualityControl(e.target.value)}
                                    />
                                  ) : (
                                    <b>{qualityControl}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Unit</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={unit}
                                      onChange={(e) => setUnit(e.target.value)}
                                    />
                                  ) : (
                                    <b>{unit}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Catatan awal</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={catatanAwal}
                                      onChange={(e) =>
                                        setCatatanAwal(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>{catatanAwal}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Catatan selesai</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={catatanSelesai}
                                      onChange={(e) =>
                                        setCatatanSelesai(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>{catatanSelesai}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Subtotal</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={hargaPembelian}
                                      onChange={(e) =>
                                        setHargaPembelian(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>{moneyFormat(hargaPembelian)}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Total</th>
                                <td>
                                  <b>{moneyFormat(hargaPembelian)}</b>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div
                            className="d-flex justify-content-end mt-3"
                            style={{ gap: "10px" }}
                          >
                            <Link className="dropdown-item" to="/pembelian">
                              <button
                                type="button"
                                className="btn btn-danger"
                              >
                                Back
                              </button>
                            </Link>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleEditToggle}
                            >
                              {isEditing ? "Save" : "Edit"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <h2>tab cetak barcode</h2>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </LayoutAdmin>
  );
}
