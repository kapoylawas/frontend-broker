//import react router dom
import { Routes, Route, Navigate } from "react-router-dom";

//import store
import { useStore } from '../stores/user';

//import view
import Login from "../views/auth/login.jsx";
import Dashboard from "../views/dashboard/index.jsx";
import Pembelian from "../views/pembelian/index.jsx";
import ShowBarang from "../views/pembelian/showBarang.jsx";
import Penjualan from "../views/penjualan/index.jsx";
import Supplier from "../views/supplier/index.jsx";

export default function AppRoutes() {

    //destruct state "token" from store
    const { token } = useStore();

    return (
        <Routes>

            {/* route "/" */}
            <Route path="/" element={
                token ? <Navigate to="/dashboard" replace /> : <Login />
            } />

            {/* route "/dashboard" */}
            <Route path="/dashboard" element={
                token ? <Dashboard /> : <Navigate to="/" replace />
            } />

            {/* rout "pembelian" */}
            <Route path="/pembelian" element={
                token ? <Pembelian /> : <Navigate to="/" replace />
            } />

            {/* rout "penjualan" */}
            <Route path="/penjualan" element={
                token ? <Penjualan /> : <Navigate to="/" replace />
            } />

            {/* rout "show barang pembelian" */}
            <Route path="/showBarang/:id" element={
                token ? <ShowBarang /> : <Navigate to="/" replace />
            } />

            {/* rout "supplier" */}
            <Route path="/supplier" element={
                token ? <Supplier /> : <Navigate to="/" replace />
            } />

        </Routes>
    );
}