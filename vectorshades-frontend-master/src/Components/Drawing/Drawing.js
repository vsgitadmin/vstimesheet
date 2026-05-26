import { useEffect, useState } from 'react'
import styles from '../../../styles/ActiveTasks.module.css'
import style from '../JobCard/index.module.css'
import AddDrawingPopup from '../Popups/Project/AddDrawingPopup'
import { createDrawingController, deleteDrawingController, getAllDrawingController, updateDrawingController } from "../../Controllers/projects";
import { toast } from "react-toastify";
import { Grow } from "@mui/material";
import EditDrawingPopup from '../Popups/Project/EditDrawingPopup'

const Drawing = ({ data }) => {
    const [addDrawingPopup, setAddDrawingPopup] = useState(false)
    const [drawings, setDrawings] = useState([])
    const [editPopupData, setEditPopupData] = useState(null)

    useEffect(() => {
        fetchDrawings()
    }, []);

    const fetchDrawings = () => {
        getAllDrawingController({ projectId: data._id }).then((res) => {
            setDrawings(res.data.response.data)
        }).catch((r) => console.log(r))
    }

    const createDrawing = ({ name, deuDate, estimatedHour }) => {
        createDrawingController({ name, deuDate, estimatedHour, projectId: data._id, client: data.client }).then((r) => {
            fetchDrawings()
            setAddDrawingPopup(false)
        }).catch((e) => {
            toast.error(e.message);
            console.log(e)
        })
    }

    const handleUpdate = (data) => {
        updateDrawingController(data)
            .then(() => {
                fetchDrawings()
                setEditPopupData(null)
                toast.success('Drawing Updated Succesfully')
            })
            .catch(e => {
                toast.error(e.message)
                console.error(e)
            })
    }

    const deleteDrawing = (id) => {
        deleteDrawingController({ id }).then(async (r) => {
            await fetchDrawings()
            toast.success("Drawing Deleted Successfully")
        }).catch((e) => {
            toast.error(e.message);
        })
    }

    return (<>
        <AddDrawingPopup createDrawing={createDrawing} addDrawingPopup={addDrawingPopup}
            setAddDrawingPopup={setAddDrawingPopup} />
        <EditDrawingPopup
            open={!!editPopupData}
            onClose={() => setEditPopupData(null)}
            onSubmit={handleUpdate}
            defaultData={editPopupData}
        />
        <div className='container'>
            <div className={styles.tasks_top_bar}>
                <h4>Drawings</h4>
                <div>
                    <button onClick={() => setAddDrawingPopup(true)} className={styles.create_task_btn}>Add
                        Drawing
                    </button>
                </div>
            </div>

            <div className={styles.drawing_container}>
                {drawings.map((drawing) => {
                    return <Grow in >
                        <div className={style.card} style={{ height: "auto", width: "25%" }}>
                            <div className={style.card_child}>
                                <div className={style.h3_container}>
                                    <h3 className={style.h3_container_text}>{drawing.name}</h3>
                                </div>
                                <div className={style.flex_details_container}>
                                    <h5 className={style.flex_details_container_text}>
                                        <span>Date Added :  </span>{' ' + new Date(drawing.createdAt).toDateString()}</h5>
                                </div>

                                <button onClick={() => deleteDrawing(drawing._id)} className={styles.create_task_btn}>
                                    DELETE
                                </button>
                                <button onClick={() => setEditPopupData(drawing)} style={{ marginLeft: '10px' }} className={styles.create_task_btn}>
                                    EDIT
                                </button>
                            </div>
                        </div>
                    </Grow>
                })}
            </div>
        </div>
    </>)
}

export default Drawing
