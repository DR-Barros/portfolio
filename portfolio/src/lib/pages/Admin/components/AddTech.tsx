import { useState } from "react"
import { supabase } from "../../../supabase"
import type { TechType } from "../../../types/tech_type"

type AddTechTypeProps = {
  update: () => void | Promise<void>
  techType: TechType[]
}


export default function AddTech({ update, techType }: AddTechTypeProps) {
    const [form, setForm] = useState<{
        tipo:number | null,
        tecnologia: string
    }>({
        tipo: null,
        tecnologia: ""
    })

    const sendTechType= async () =>{
        console.log(form)
        const { data, error } = await supabase
        .from('tech')
        .insert({
            technology: form.tecnologia,
            type: form.tipo
        })
        .select()
        if (error) console.error(error)
        if (data) {
            setForm({
                tipo: null,
                tecnologia: ""
            })
            update()
        }
    }


    return(
        <div className="form">
            <h3>Agregar tecnologia</h3>
            <label htmlFor="tipo">
                Tecnologia:
            </label>
            <input 
                type="text" 
                name="tipo" 
                id="tipo"
                value={form.tecnologia}
                onChange={(e)=>setForm({
                    tecnologia: e.target.value,
                    tipo: form.tipo
                })}
            />
            <select
                value={form.tipo ? form.tipo : ""}
                onChange={(e)=>setForm({
                    tipo: Number(e.target.value),
                    tecnologia: form.tecnologia
                })}
            >
                {techType.map((tech)=>{return(
                    <option key={tech.id} value={tech.id}>
                        {tech.type}
                    </option>
                )})}
            </select>
            <button onClick={sendTechType}>Enviar</button>
        </div>
    )
}