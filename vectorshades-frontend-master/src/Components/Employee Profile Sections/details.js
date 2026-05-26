import { AccountCircleOutlined, AutoAwesomeOutlined, CreditCardOutlined, ImageAspectRatioOutlined, LocalHospital, PeopleAltOutlined } from '@mui/icons-material'
import EmployeeDetailsForm from '../../../pages/admin/dashboard/employee/details/[id]'
import MultiForm from '../MultiForm/MultiForm'
import { useState } from 'react'

function EmployeeDetails({ styles, user }) {
    const [section, setsection] = useState(1)
    return (
        <div className={styles.project_settings} >
            <div className={styles.pro_left} style={{ width: "20%" }} >
                <div className={`${styles.settings_item} ${section === 1 && styles.settings_active }` } onClick={() => setsection(1)}>
                    <AccountCircleOutlined />
                    <h3>Personal Info</h3>
                </div>
                <div className={`${styles.settings_item} ${section === 2 && styles.settings_active }`} onClick={() => setsection(2)}>
                    <PeopleAltOutlined />
                    <h3>Family Details</h3>
                </div>
                <div className={`${styles.settings_item} ${section === 3 && styles.settings_active }`} onClick={() => setsection(3)}>
                    <ImageAspectRatioOutlined />
                    <h3>Education Qualification</h3>
                </div>
                <div className={`${styles.settings_item} ${section === 4 && styles.settings_active }`} onClick={() => setsection(4)}>
                    <AutoAwesomeOutlined />
                    <h3>References & Certifications</h3>
                </div>
                <div className={`${styles.settings_item} ${section === 5 && styles.settings_active }`} onClick={() => setsection(5)}>
                    <LocalHospital />
                    <h3>Emergency Contact Details</h3>
                </div>
                <div className={`${styles.settings_item} ${section === 6 && styles.settings_active }`} onClick={() => setsection(6)}>
                    <CreditCardOutlined />
                    <h3>Employment History</h3>
                </div>
            </div>
            <div className={styles.pro_right} >
                <EmployeeDetailsForm routerObj={{ query: { id: user } }} section={section} />
            </div>
        </div>
    )
}

export default EmployeeDetails