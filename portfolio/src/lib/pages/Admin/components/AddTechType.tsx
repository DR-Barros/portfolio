import { useState } from "react"
import { supabase } from "../../../supabase"


type AddTechTypeProps = {
  update: () => void | Promise<void>
}


export default function AddTechType({ update }: AddTechTypeProps) {
    const [tipo, setTipo] = useState<string>("")

    const sendTechType= async () =>{
        const { data, error } = await supabase
        .from('tech_type')
        .insert({
            type: tipo
        })
        .select()
        if (error) console.error(error)
        if (data) {
            setTipo("")
            update()
        }
    }


    return(
        <div className="form">
            <h3>Agregar tipo de tecnologia</h3>
            <label htmlFor="tipo">
                Tipo:
            </label>
            <input 
                type="text" 
                name="tipo" 
                id="tipo"
                value={tipo}
                onChange={(e)=>setTipo(e.target.value)}
            />
            <button onClick={sendTechType}>Enviar</button>
        </div>
    )
}