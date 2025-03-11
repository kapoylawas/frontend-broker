import { useParams } from "react-router-dom";
import LayoutAdmin from "../../layouts/admin";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Cookies from "js-cookie";
import Api from "../../services/api";
import { useEffect, useState } from "react";
import moneyFormat from "../../utils/moneyFormat";
// Import react-select
import Select from "react-select";

export default function ShowBarang() {
  const { id } = useParams();
  const token = Cookies.get("token");

  const [dataBarang, setDataBarang] = useState({});
  const [dataSupplier, setDataSupplier] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  console.log(supplierId);
  
  const [supplier, setSupplier] = useState([]);

  // Function to fetch suppliers
  const fetchSupplier = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get("/api/supplier-all").then((response) => {
      setSupplier(response.data.data);
    });
  };

  // Function to fetch barang masuk
  const fetchBarangMasuk = async () => {
    Api.defaults.headers.common["Authorization"] = token;
    await Api.get(`/api/barang-masuk/${id}`).then((response) => {
      setDataBarang(response.data.data);
      setDataSupplier(response.data.data.supplier);
      setSupplierId(response.data.data.supplier.id); // Set supplierId to the current supplier's ID
    });
  };

  useEffect(() => {
    fetchBarangMasuk();
    fetchSupplier();
  }, []);

  // Data for react-select
  const supplierOptions = supplier.map((sup) => ({
    value: sup.id,
    label: `${sup.name} - ${sup.kode} - ${sup.no_hp}`,
  }));

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setSupplierId(dataSupplier.id); // Set supplierId to current supplier's ID when entering edit mode
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "supplier") {
      setDataSupplier({ ...dataSupplier, name: value });
    } else if (name === "subtotal") {
      setDataBarang({ ...dataBarang, harga_pembelian: value });
    } else if (name === "item") {
      setDataBarang({ ...dataBarang, item: value });
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
                                <th>Item</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="text"
                                      name="item"
                                      value={dataBarang.item} // Ensure this is the correct property
                                      onChange={handleInputChange}
                                    />
                                  ) : (
                                    "SAMSUNG GALAXY S22 ULTRA 128GB BURGUNDY (SEIN)"
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>IMEI</th>
                                <td>
                                  <b>{dataBarang.imei}</b>
                                </td>
                              </tr>
                              <tr>
                                <th>Subtotal</th>
                                <td>
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      name="subtotal"
                                      value={dataBarang.harga_pembelian}
                                      onChange={handleInputChange}
                                    />
                                  ) : (
                                    <b>
                                      {moneyFormat(dataBarang.harga_pembelian)}
                                    </b>
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
                                <td>8,000,000</td>
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
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleEditToggle}
                            >
                              {isEditing ? "Save" : "Edit"}
                            </button>
                            <button type="button" className="btn btn-primary">
                              Submit
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