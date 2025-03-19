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
  const [namaHandPhone, setNamaHandPhone] = useState("");
  console.log(namaHandPhone);

  const [handPhoneId, setHandPhoneId] = useState("");
  const [imei, setImei] = useState("");
  const [jenisPembelian, setJenisPembelian] = useState("");
  const [tanggalPembelian, setTanggalPembelian] = useState("");
  const [sales, setSales] = useState("");
  const [catatanAwal, setCatatanAwal] = useState("");
  const [catatanSelesai, setCatatanSelesai] = useState("");
  const [hargaPembelian, setHargaPembelian] = useState("");
  const [supplier, setSupplier] = useState([]);
  const [handPhone, setHandPhone] = useState([]);

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

  const fetchBarangMasuk = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get(`/api/barang-masuk/${id}`).then((response) => {
      // setDataBarang(response.data.data);
      setDataSupplier(response.data.data.supplier);
      setDataHandPhone(response.data.data.handphone);
      setImei(response.data.data.imei);
      setJenisPembelian(response.data.data.jenis_pembelian);
      setTanggalPembelian(response.data.data.tanggal_pembelian);
      setSales(response.data.data.sales);
      setCatatanAwal(response.data.data.catatan_awal);
      setCatatanSelesai(response.data.data.catatan_selesai);
      setHargaPembelian(response.data.data.harga_pembelian);
      setSupplierId(response.data.data.supplier.id);
      setHandPhoneId(response.data.data.handphone.id);
      setNamaHandPhone(response.data.data.name_handphone);
    });
  };

  useEffect(() => {
    fetchBarangMasuk();
    fetchSupplier();
    fetchHandPhone();
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

  const handleEditToggle = async () => {
    if (isEditing) {
      await updateBarangMasuk();
    }
    setIsEditing(!isEditing);
  };

  const updateBarangMasuk = async () => {
    const payload = {
      supplier_id: supplierId,
      imei: imei,
      handphone_id: handPhoneId,
      harga_pembelian: hargaPembelian,
      name_handphone: namaHandPhone,
      sales: sales,
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
                  <Tab>CANCEL</Tab>
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
                                <th>Nota Number</th>
                                <td>250380DF5B</td>
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
                                <th>Purchase Type</th>
                                <td>PEMBELIAN LANGSUNG</td>
                              </tr>
                              <tr>
                                <th>Nama Handphone</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={namaHandPhone}
                                      onChange={(e) =>
                                        setNamaHandPhone(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <b>{namaHandPhone}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Tipe Handphone</th>
                                <td>
                                  {isEditing ? (
                                    <Select
                                      options={handPhoneOptions}
                                      value={handPhoneOptions.find(
                                        (option) => option.value === handPhoneId
                                      )}
                                      onChange={(selectedOption) =>
                                        setHandPhoneId(
                                          selectedOption
                                            ? selectedOption.value
                                            : ""
                                        )
                                      }
                                      placeholder="-- Select Handphone --"
                                    />
                                  ) : (
                                    <b>{dataHandPhone.name}</b>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>IMEI</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={imei}
                                      onChange={(e) => setImei(e.target.value)}
                                      placeholder="Scan IMEI"
                                    />
                                  ) : (
                                    <b>{imei}</b>
                                  )}
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
                                <th>Sales</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value={sales}
                                      onChange={(e) => setSales(e.target.value)}
                                    />
                                  ) : (
                                    <b>{sales}</b>
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
                                <th>Discount</th>
                                <td>0</td>
                              </tr>
                              <tr>
                                <th>Cost</th>
                                <td>0</td>
                              </tr>
                              <tr>
                                <th>Total</th>
                                <td>
                                  <b>{moneyFormat(hargaPembelian)}</b>
                                </td>
                              </tr>
                              <tr>
                                <th>Payment Status</th>
                                <td>0</td>
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
                  <h2>tab cancel</h2>
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
