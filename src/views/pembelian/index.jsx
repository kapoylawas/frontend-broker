//import layout admin
import { useEffect, useState } from 'react';
import LayoutAdmin from '../../layouts/admin'
import PembelianCreate from './create'
//import js cookie
import Cookies from "js-cookie";
//import service api
import Api from "../../services/api";
//import rupiah
import moneyFormat from "../../utils/moneyFormat";
//import component pagination
import PaginationComponent from "../../components/Pagination";
// Import Skeleton
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteButton from '../../components/DeleteButton';

export default function Dashboard() {

    //state products
    const [products, setProducts] = useState([]);
    console.log("data =>", products);


    //define state "pagination"
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 0,
        total: 0,
    });

    //state keywords
    const [keywords, setKeywords] = useState("");

    const [loading, setLoading] = useState(false); // Loading state

    //define method "fetchData"
    const fetchData = async (pageNumber, keywords = "") => {
        //define variable "page"
        const page = pageNumber ? pageNumber : pagination.currentPage;

        //get token from cookies inside the function to ensure it's up-to-date
        const token = Cookies.get("token");

        if (token) {
            //set authorization header with token
            Api.defaults.headers.common["Authorization"] = token;

            setLoading(true); // Set loading to true before fetching data

            try {
                //fetch data from API with Axios
                const response = await Api.get(
                    `/api/barang-masuk?page=${page}&search=${keywords}`
                );

                //assign response data to state "products"
                setProducts(response.data.data);

                //set pagination
                setPagination(() => ({
                    currentPage: response.data.pagination.currentPage,
                    perPage: response.data.pagination.perPage,
                    total: response.data.pagination.total,
                }));
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        } else {
            console.error("Token is not available!");
        }
    };

    //call function "fetchData"
    useEffect(() => {
        fetchData();
    }, []);

    //function "searchHandler"
    const searchHandlder = () => {
        //call function "fetchDataPost" with params
        fetchData(1, keywords);
    };

    //function "handleKeyDown"
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            searchHandlder();
        }
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
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-12 mb-3">
                            <div className="input-group">
                                <PembelianCreate fetchData={fetchData} />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="search by number IMEI"
                                />
                                <button
                                    onClick={searchHandlder}
                                    className="btn btn-md btn-primary"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="card">
                                <div className="table-responsive">
                                    {loading ? (
                                        <div>
                                            <Skeleton count={5} height={40} />
                                        </div>
                                    ) : (
                                        <table className="table table-vcenter table-mobile-md card-table">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>IMEI</th>
                                                    <th>Supplier</th>
                                                    <th>HandPhone</th>
                                                    <th>Harga Pembelian</th>
                                                    <th>Jenis Pembelian</th>
                                                    <th>Tanggal Pembelian</th>
                                                    <th>Sales</th>
                                                    <th>Catatan</th>
                                                    <th className="w-1">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.length > 0 ? (
                                                    products.map((product, index) => (
                                                        <tr key={index}>
                                                            <td data-label="No">
                                                                {(pagination.currentPage - 1) * pagination.perPage + index + 1}
                                                            </td>
                                                            <td data-label="imei">
                                                                {product.imei}
                                                            </td>
                                                            <td data-label="Supplier Name">
                                                                <div className="d-flex py-1 align-items-center">
                                                                    <div className="flex-fill">
                                                                        <div className="font-weight-medium">
                                                                            {product.supplier.name}
                                                                            <hr />
                                                                            <span className="badge" style={{ backgroundColor: 'blue', color: 'white' }}>{product.supplier.no_hp}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="text-muted" data-label="HandPhone">
                                                                {product.handphone.name}
                                                            </td>
                                                            <td data-label="Buy Price">
                                                                {moneyFormat(product.harga_pembelian)}
                                                            </td>
                                                            <td data-label="Sell Price">
                                                                {product.jenis_pembelian}
                                                            </td>
                                                            <td data-label="Tanggal Pembelian">
                                                                {product.tanggal_pembelian ? product.tanggal_pembelian.split('T')[0] : "Tanggal tidak tersedia"}
                                                            </td>
                                                            <td data-label="Stock">
                                                                {product.sales}
                                                            </td>
                                                            <td data-label="Stock">
                                                                {product.catatan_awal}
                                                            </td>
                                                            <td>
                                                                <div className="btn-list flex-nowrap">
                                                                    <DeleteButton
                                                                        id={product.id}
                                                                        endpoint="/api/barang-masuk"
                                                                        fetchData={fetchData}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="text-center">
                                                            <div className="alert alert-danger mb-0">
                                                                Data Belum Tersedia!
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    )}
                                    <PaginationComponent
                                        currentPage={pagination.currentPage}
                                        perPage={pagination.perPage}
                                        total={pagination.total}
                                        onChange={(pageNumber) => fetchData(pageNumber, keywords)}
                                        position="end"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}