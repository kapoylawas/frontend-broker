//import layout admin
import LayoutAdmin from '../../layouts/admin'
import PenjualanCreate from './create'

export default function Penjualan() {
    return (
        <LayoutAdmin>
            <div className="page-body">
                <div className="container-xl">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <div className="page-body">
                                <div className="container-xl">
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="col-12 mb-3">
                                                <PenjualanCreate />
                                                <div className="input-group">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAdmin>
    )
}