//import layout admin
import LayoutAdmin from '../../layouts/admin'

export default function Dashboard() {
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
                                DASHBOARD
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}