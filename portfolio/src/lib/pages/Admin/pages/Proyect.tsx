import { useParams, useNavigate, Link} from 'react-router-dom';
import { supabase } from "../../../supabase"
import { useEffect, useState } from "react"
import "./Proyect.css"
import AddChapter from '../components/AddChapter';
import type { Proyects } from "../../../types/proyects"
import type { Tech } from '../../../types/tech';
import type { Chapter }  from '../../../types/chapter';


export default function Proyect(){
    const [proyect, setProyect] = useState<Proyects | null>()
    let {id} = useParams()
    const navigate = useNavigate();
    const [image, setImage] = useState<File | null>(null)
    const [tech, setTech] = useState<Tech[]>([])
    const [selectedTech, setSelectedTech] = useState<number>(-1)
    const [techProyect, setTechProyect] = useState<number[]>([])
    const [chapters, setChapters] = useState<Chapter[]>([])


    const fetchProyect= async () => {
        const { data, error } = await supabase
        .from('proyect')
        .select('*')
        .eq("id", id)
        .single()
        if (error) console.error(error)
        if (data) setProyect(data)
    }

    const saveProyect = async () => {
        let filePath = ""
        if (image){
            const fileExt = image.name.split(".").pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`
            filePath = `proyects/${fileName}`

            const { error: uploadError } = await supabase.storage
            .from("content")
            .upload(filePath, image)
            if (uploadError) {
                console.error("Upload error:", uploadError)
                return
            }
        }
        const { error: insertError } = await supabase
        .from("proyect")
        .update({
            title: proyect?.title,
            description: proyect?.description,
            github: proyect?.github,
            photo_url: proyect?.photo_url,
            created_at: proyect?.created_at,
            is_public: proyect?.is_public
        })
        .eq('id', proyect?.id)

        if (insertError) {
        console.error("Insert error:", insertError)
        return
        }
        fetchProyect()
    }

    const fetchTech= async () => {
        const { data, error } = await supabase
        .from('tech')
        .select('id, technology, tech_type(id, type)')
        if (error) console.error(error)
        if (data) setTech(data)
    }

    const fetchTechProyect= async () => {
        const { data, error } = await supabase
        .from('tech_proyect')
        .select('tech')
        .eq("proyect", proyect?.id)
        if (error) console.error(error)
        if (data) setTechProyect(data.map(d=>d.tech))
    }

    const fetchChapters= async () => {
        const { data, error } = await supabase
        .from('chapter')
        .select('*')
        .eq("proyect_id", proyect?.id)
        if (error) console.error(error)
        if (data) setChapters(data)
    }

    const insertTechProyect= async (tech: number) => {
        const { data, error } = await supabase
        .from('tech_proyect')
        .insert({
            tech: tech,
            proyect: proyect?.id
        })
        if (error) throw Error(error.message)
        if (data) return
    }

    useEffect(()=>{
        fetchProyect()
        fetchTech()
    }, [])

    useEffect(()=>{
        if (!proyect) return
        fetchTechProyect()
        fetchChapters()
    }, [proyect])

    return(<div className='admin-proyect'>
        <h1>Proyecto id: {proyect?.id}</h1>
        <section style={{
            margin: 20, 
            padding: 20, 
            border: "1px solid black", 
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
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
            <img
                src={proyect?.photo_url || '/placeholder.png'}
                alt={proyect?.title}
                style={{ 
                    width: '268px',
                    height: '268px', 
                    objectFit: 'cover',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) =>setImage(e.target.files?.[0] ?? null)}
            />
            <label htmlFor='title'>Es publico:</label>
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
            <button onClick={saveProyect}>
                Guardar
            </button>
        </section>
        <section style={{margin: 20, padding: 20, border: "1px solid black", borderRadius: 10}}>
            <h2>Capitulos</h2>
            {chapters.map((chapter)=>{return(
                <div key={chapter.id} style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <h3>{chapter.title}</h3>
                    <p>({chapter.created_at})</p>
                    <Link to={"chapter/"+chapter.id}>
                        ir a
                    </Link>
                </div>
            )})}
            <AddChapter
                update={()=>{}}
                id={proyect ? proyect.id : -1}
            />
        </section>
        <section style={{margin: 20, padding: 20, border: "1px solid black", borderRadius: 10}}>
            <h2>Tecnologias</h2>
            <select
                value={selectedTech}
                onChange={(e)=>setSelectedTech(Number(e.target.value))}
            >
                <option key={-1} value={-1}>
                    Seleccione una opción
                </option>
                {tech.map((tech)=>{return(
                    <option key={tech.id} value={tech.id}>
                        {tech.technology}
                    </option>
                )})}
            </select>
            <button onClick={()=>{
                if (selectedTech == -1) {
                    console.log(selectedTech)
                    return
                }
                if (techProyect.includes(selectedTech)) {
                    console.log(selectedTech)
                    console.log(techProyect)
                    return
                }
                insertTechProyect(selectedTech) 
                setTechProyect(prev => [...prev, selectedTech])
            }}>
                Agregar
            </button>
            {techProyect.map((t) =>{
                return(<p key={t}>
                    {tech.find(tech => tech.id === t)?.technology}
                </p>)
            })}
        </section>
        <button onClick={()=>{navigate(-1)}}>
            Volver
        </button>
    </div>)
}