import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "../../../supabase"
import type { Proyects } from "../../../types/proyects"
import { useEffect, useState } from "react"
import "./Proyect.css"


export default function Proyect(){
    const [proyect, setProyect] = useState<Proyects | null>()
    let {id} = useParams()
    const navigate = useNavigate();

    const fetchProyects= async () => {
        const { data, error } = await supabase
        .from('proyect')
        .select('*')
        .eq("id", id)
        .single()
        if (error) console.error(error)
        if (data) setProyect(data)
    }

    useEffect(()=>{
        fetchProyects()
    }, [])

    return(<div className='admin-proyect'>
        <h1>ID: {proyect?.id}</h1>
        <label htmlFor='title'>Titulo:</label>
        <input 
            type='text' 
            value={proyect?.title}
            onChange={(e) => {
                if (!proyect) return
                setProyect({
                    ...proyect,
                    title: e.target.value,
                })
            }}
        />
        <label htmlFor='description'>Descripción:</label>
        <textarea
            value={proyect?.description}
            onChange={(e) => {
                if (!proyect) return
                setProyect({
                    ...proyect,
                    description: e.target.value,
                })
            }}
        />
        <label htmlFor='github'>Github Link:</label>
        <input 
            type='text' 
            value={proyect?.github}
            onChange={(e) => {
                if (!proyect) return
                setProyect({
                    ...proyect,
                    github: e.target.value,
                })
            }}
        />
        <label htmlFor='created_at'>Creado:</label>
        <input 
            type='date' 
            value={proyect?.created_at}
            onChange={(e) => {
                if (!proyect) return
                setProyect({
                    ...proyect,
                    created_at: e.target.value,
                })
            }}
        />
        <label htmlFor='title'>Titulo:</label>
        <input 
            type='checkbox' 
            checked={proyect?.is_public}
            onChange={() => {
                if (!proyect) return
                setProyect({
                    ...proyect,
                    is_public: !proyect.is_public,
                })
            }}
        />
        <button onClick={()=>{console.log(proyect)}}>
            Guardar
        </button>
        <button onClick={()=>{navigate(-1)}}>
            Volver
        </button>
    </div>)
}