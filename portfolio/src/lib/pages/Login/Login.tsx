import { useState } from 'react'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'
import "./Login.css"


export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    const login = async () => {
        const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        })
        if (error) alert(error.message)
        else navigate("/admin")
    }

    return (
        <div className='login'>
            <input placeholder="email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Login</button>
        </div>
    )
}