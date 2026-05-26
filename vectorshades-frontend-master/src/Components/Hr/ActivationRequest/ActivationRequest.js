import React, {useState} from 'react';
import styles from '../../../../styles/Hr.module.css';
import {Visibility, Tune} from '@mui/icons-material';
import {useRouter} from 'next/router';
import ProfileImage from '../../ProfileImage/Image';
import NoDataFound from "../../NoDataFound/NoDataFound";


function ActivationRequest({props, onChange}) {
    const router = useRouter()
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const noStyle = {
        height: '76%', display: 'flex', alignItems: 'center'
    }
    return (<>
            {/* search filter start */}
            <div className={styles.ar_search_filter}>
                <input placeholder='Search' type="text" onChange={onChange}/>
            </div>
            {/* search filter end */}

            {/* activation request list start */}
            <div className={styles.ar_list_container}>
                {!props || props?.length === 0 && <div style={noStyle}><NoDataFound/></div>}
                {props && props.length !== 0 && props.map((data, index) => {
                    return (<div className={styles.ar_list_box} key={index}>
                            <div className={styles.ar_profile}>
                                <ProfileImage size={45} id={data.empId}/>
                            </div>
                            <div className={styles.ar_user_name_des}>
                                <h3 style={{fontSize: '15px'}}>{data.empName}</h3>
                                <h4>{data.designation}</h4>
                                <h5>Requested on
                                    - {data.requestedDate.substring(0, data.requestedDate.indexOf('T'))}</h5>
                            </div>
                            {data.approved && <div className={`${styles.ar_request_status} ${styles.status_pending}`}>
                                <div>approved</div>
                            </div>}
                            <div className={styles.view_btn}>
                                <button onClick={() => router.push(`/admin/dashboard/hr/activation/${data._id}`)}>
                                    <Visibility style={{fontSize: "15px", fill: "white"}}/>VIEW
                                </button>
                            </div>
                        </div>)
                })}
            </div>
            {/* activation request list end */}

        </>)
}

export default ActivationRequest;