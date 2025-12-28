// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
const Portfolio = lazy(()=> import("./lib/pages/Portfolio/Portfolio"))
const Login = lazy(()=> import("./lib/pages/Login/Login"))
const Admin = lazy(()=> import("./lib/pages/Admin/Admin"))
import { CircularProgress } from "@mui/material";
import PrivateRoute from "./lib/components/PrivateRoute";

const basename = import.meta.env.PROD ? "/portfolio" : "/"

function App(){
    return(
        <BrowserRouter basename={basename}>
        <Suspense fallback={<div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}><CircularProgress /></div>}>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/login" element={<Login />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/admin" element={<Admin/>} />
                </Route>
            </Routes>
        </Suspense>
        </BrowserRouter>
    )
}

export default App
