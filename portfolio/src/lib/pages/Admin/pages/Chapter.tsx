import { useParams, useNavigate } from 'react-router-dom';


export default function ChapterPage(){
    let {id} = useParams()
    const navigate = useNavigate();
    

    return(<div className='admin-proyect'>
        <h1>Capitulo id: {id}</h1>
       
        <button onClick={()=>{navigate(-1)}}>
            Volver
        </button>
    </div>)
}