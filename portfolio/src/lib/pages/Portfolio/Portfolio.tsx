import { useEffect, useState } from "react"
import { supabase } from "../../supabase"
import "./Portfolio.css"
import { Card, CardContent } from "@mui/material"
import type { Proyects } from "../../types/proyects"

export default function Portfolio(){
    const [proyects, setProyects] = useState<Proyects[]>([])

    const fetchProyects= async () => {
        const { data, error } = await supabase
        .from('proyect')
        .select('*')
        .eq('is_public', true)
        if (error) console.error(error)
        if (data) setProyects(data)
    }

    useEffect(()=>{
        fetchProyects()
    },[])
    return(
        <div className="portfolio">
        <header className="hero">
            <h2>
                Ingeniero Civil en Computación
            </h2>
            <h3>
                Desarrollo software, soluciones data-driven y sistemas backend escalables.
            </h3>
            <p>
                Experiencia en aplicaciones full-stack, modelamiento de datos y machine learning,
con foco en diseño limpio, decisiones técnicas y mantenibilidad.
            </p>
        </header>
        <section className="proyectos">
            <h2>Proyectos</h2>
            {proyects.map((proyect)=>{
                return(
                    <Card key={proyect.id} sx={{width: 300}}>
                        <CardContent>
                            <img
                                src={proyect.photo_url || '/placeholder.png'}
                                alt={proyect.title}
                                style={{ 
                                    width: '268px',
                                    height: '268px', 
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            />
                            <h3>{proyect.title}</h3>
                            <p>{proyect.description}</p>
                        </CardContent>
                    </Card>
            )})}
        </section>
        <section>
            <h2>Habilidades</h2>
        </section>
        <section>
            <h2>Experiencia</h2>
        </section>
        </div>
    )
}