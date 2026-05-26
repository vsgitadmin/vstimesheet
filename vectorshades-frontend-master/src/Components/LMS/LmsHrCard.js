import { useState } from 'react'
import styles from '../../../styles/LMS.module.css'
import ProfileImage from '../ProfileImage/Image'


const HrCard = ({ data, setselectedTriningData, setLmsPopup,style }) => {

    const percentageCalculator = (o) => {
        let percentage = (o.timeSpent / (o.duration * 60 * 60)) * 100
        return percentage > 100 ? 100 : percentage
    }

    const [viewDesc, setViewDesc] = useState(false)

    return <>
        <div style={style} onClick={() => { setselectedTriningData(data); setLmsPopup(true) }} className={`${styles.on_card} ${styles.on_card_hr}`} >
            <div>
                <p>{data?.name}</p>
                <span>{data?.description?.slice(0, 100)}{data?.description?.length > 100 &&<span>...</span>}</span>
                {/*{viewDesc&&<br/>}*/}
                {/*<span onClick={(e) => {e.stopPropagation();setViewDesc(!viewDesc)}} style={{ color: 'blue' }} variant='button'>{viewDesc?'Hide':'View'} desc</span>*/}
            </div>
            <div className={styles.lms_users} >
                {data?.assignedTo?.length===0&&<div style={{visibility:'collapse',width:'30px',height:'30px'}}>dwdw</div>}
                {data?.assignedTo?.map((p) => {
                    return <ProfileImage size={30} id={p} />
                })}
            </div>
            <div>
                <h5>{data?.assignedTo?.length} users</h5>
            </div>
            <div className={styles.progress} >
                {!data?.completed && <span style={{ color: data?.active ? 'darkgreen' : 'red' }} variant='button'>{data?.active ? 'Active' : 'Inactive'}</span>}
                {data?.completed && <span className='relaxed' style={{fontSize:"12px",borderRadius:"50px",paddingLeft:"7px", paddingRight:"7px",padding:"3px"}} >Completed</span>}
            </div>
        </div>
    </>
}

export default HrCard