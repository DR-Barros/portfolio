import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../supabase";
import { CircularProgress } from "@mui/material";

const PrivateRoute = () => {
    const [loading, setLoading] = useState(true)
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
        const { data } = await supabase.auth.getSession()
        setAuthenticated(!!data.session)
        setLoading(false)
        }

        checkAuth()
    }, [])

    if (loading) return <CircularProgress />

    return authenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute