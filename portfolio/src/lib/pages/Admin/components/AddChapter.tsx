import { useState } from "react"
import { supabase } from "../../../supabase"

type AddProyectProps = {
  update: () => void | Promise<void>
  id: number
}

type ProyectForm = {
  title: string
  is_public: boolean
  created_at: string
}

export default function AddChapter({ update, id }: AddProyectProps) {
    const [form, setForm] = useState<ProyectForm>({
        title: "",
        is_public: false,
        created_at: ""
    })

    const sendProyect = async () => {
        /* 3️⃣ Insertar proyecto */
        const { error: insertError } = await supabase
        .from("chapter")
        .insert({
            proyect_id: id,
            title: form.title,
            is_public: form.is_public,
            created_at: form.created_at
        })

        if (insertError) {
        console.error("Insert error:", insertError)
        return
        }

        /* 4️⃣ Reset */
        setForm({
        title: "",
        is_public: false,
        created_at: ""
        })

        update()
    }

    return (
        <div className="form">
        <h3>Agregar Capitulo</h3>
        <label htmlFor="date">Fecha</label>
        <input
        type="date"
        id="date"
        value={form.created_at}
        onChange={(e) =>
            setForm({ ...form, created_at: e.target.value })
        }
        />

        <input
            type="text"
            placeholder="Título"
            value={form.title}
            onChange={(e) =>
            setForm({ ...form, title: e.target.value })
            }
        />

        <label>
            <input
            type="checkbox"
            checked={form.is_public}
            onChange={(e) =>
                setForm({ ...form, is_public: e.target.checked })
            }
            />
            Público
        </label>

        <button onClick={sendProyect}>
            Enviar
        </button>
        </div>
    )
}
