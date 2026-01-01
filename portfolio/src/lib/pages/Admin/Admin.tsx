import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import type { Proyects } from "../../types/proyects"
import type { Tech } from "../../types/tech"
import type { TechType } from "../../types/tech_type"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import AddTechType from "./components/AddTechType"
import "./Admin.css"
import AddTech from "./components/AddTech"
import AddProyect from "./components/AddProyect"
import { useNavigate } from 'react-router-dom'


export default function Admin(){
    const [proyects, setProyects] = useState<Proyects[]>([])
    const [tech, setTech] = useState<Tech[]>([])
    const [techType, setTechType] = useState<TechType[]>([])
    const navigate = useNavigate();
    
    const fetchProyects= async () => {
        const { data, error } = await supabase
        .from('proyect')
        .select('*')
        .order('created_at', { ascending: false })
        if (error) console.error(error)
        if (data) setProyects(data)
    }

    const changePublicProyects = async (id: number) => {
        const { data: proyect, error: fetchError } = await supabase
            .from("proyect")
            .select("is_public")
            .eq("id", id)
            .single()

        if (fetchError) {
            console.error(fetchError)
            return
        }
        const { data, error } = await supabase
            .from("proyect")
            .update({ is_public: !proyect.is_public })
            .eq("id", id)
            .select()
        if (error) console.error(error)
        if (data) setProyects(data)
    }



    const fetchTech= async () => {
        const { data, error } = await supabase
        .from('tech')
        .select('id, technology, tech_type(id, type)')
        if (error) console.error(error)
        if (data) setTech(data)
    }

    const fetchTechType= async () => {
        const { data, error } = await supabase
        .from('tech_type')
        .select('*')
        if (error) console.error(error)
        if (data) setTechType(data)
    }

    useEffect(()=>{
        fetchProyects()
        fetchTech()
        fetchTechType()
    },[])

    return(
        <div className="admin">
            <div>
            <h1>
                Proyectos
            </h1>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Titulo</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Publico</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {proyects.map((proyect)=>{return(
                        <TableRow key={proyect.id}>
                            <TableCell>{proyect.id}</TableCell>
                            <TableCell>{proyect.title}</TableCell>
                            <TableCell>{proyect.created_at}</TableCell>
                            <TableCell>{proyect.is_public ? "Si": "No"}</TableCell>
                            <TableCell sx={{display: "flex", flexDirection: "column"}}>
                                <button onClick={()=>{changePublicProyects(proyect.id)}}>
                                    Cambiar visibilidad
                                </button>
                                <button onClick={()=>{
                                    navigate("proyect/"+proyect.id)
                                }}>
                                    editar
                                </button>
                            </TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
            <AddProyect update={fetchProyects} />
            </div>
            <div>
            <h1>
                Trabajos
            </h1>
            </div>
            <div>
            <h1>
                Tecnologias
            </h1>
            <div className="row">
            <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tecnologia</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tech.map((t)=>{return(
                        <TableRow key={t.id}>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{t.technology}</TableCell>
                            <TableCell>{t.tech_type instanceof Array ? t.tech_type[0].type : t.tech_type.type}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
            </div>
            <div>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Tipo</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {techType.map((t)=>{return(
                        <TableRow key={t.id}>
                            <TableCell>{t.id}</TableCell>
                            <TableCell>{t.type}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    )})}
                </TableBody>
            </Table>
            </div>
            </div>
            <div className="row">
                <AddTech
                    update={fetchTech}
                    techType={techType}
                />
                <AddTechType
                    update={fetchTechType}
                />
            </div>
            </div>
        </div>
    )
}