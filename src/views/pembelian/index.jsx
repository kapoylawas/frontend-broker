//import layout admin
import { useState } from 'react';
import LayoutAdmin from '../../layouts/admin'
import PembelianCreate from './create'

export default function Dashboard() {
    //state keywords
    const [keywords, setKeywords] = useState("");

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
                                <PembelianCreate />
                                <input
                                    type="text"
                                    className="form-control"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="search by product name"
                                />
                                <button
                                    onClick={searchHandlder}
                                    className="btn btn-md btn-primary"
                                >
                                    SEARCH
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}