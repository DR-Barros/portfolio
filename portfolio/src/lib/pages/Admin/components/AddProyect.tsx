import { useState } from "react"
import { supabase } from "../../../supabase"

type AddProyectProps = {
  update: () => void | Promise<void>
}

type ProyectForm = {
  title: string
  description: string
  github: string
  is_public: boolean
  image: File | null
  created_at: string
}

export default function AddProyect({ update }: AddProyectProps) {
    const [form, setForm] = useState<ProyectForm>({
        title: "",
        description: "",
        github: "",
        is_public: false,
        image: null,
        created_at: ""
    })

    const sendProyect = async () => {
        if (!form.title || !form.image) return

        /* 1️⃣ Subir imagen */
        const fileExt = form.image.name.split(".").pop()
        const fileName = `${crypto.randomUUID()}.${fileExt}`
        const filePath = `proyects/${fileName}`

        const { error: uploadError } = await supabase.storage
        .from("content")
        .upload(filePath, form.image)

        if (uploadError) {
        console.error("Upload error:", uploadError)
        return
        }

        /* 2️⃣ Obtener URL pública */
        const { data: publicUrl } = supabase.storage
        .from("content")
        .getPublicUrl(filePath)

        /* 3️⃣ Insertar proyecto */
        const { error: insertError } = await supabase
        .from("proyect")
        .insert({
            title: form.title,
            description: form.description,
            github: form.github,
            is_public: form.is_public,
            photo_url: publicUrl.publicUrl,
            created_at: form.created_at
        })

        if (insertError) {
        console.error("Insert error:", insertError)
        return
        }

        /* 4️⃣ Reset */
        setForm({
        title: "",
        description: "",
        github: "",
        is_public: false,
        image: null,
        created_at: ""
        })

        update()
    }

    return (
        <div className="form">
        <h3>Agregar proyecto</h3>
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

        <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={(e) =>
            setForm({ ...form, description: e.target.value })
            }
        />

        <input
            type="text"
            placeholder="GitHub URL"
            value={form.github}
            onChange={(e) =>
            setForm({ ...form, github: e.target.value })
            }
        />

        <input
            type="file"
            accept="image/*"
            onChange={(e) =>
            setForm({
                ...form,
                image: e.target.files?.[0] ?? null,
            })
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
