import { AccountCircle, AddAPhoto, Business, Description, Settings, Work } from '@mui/icons-material'
import { MenuItem } from '@mui/material'
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ParentStore } from '../../../pages/_app';
import { uploadS3Document} from '../../../src/Controllers/files/index'
import SettingPopup from '../Popups/Settings/SettingsPopup';

const ProfileDropdown = ({setProfileDropdown, openSettings}) => {

    const { ParentState } = useContext(ParentStore);
    const [Img, setImg] = useState(null)
    const router = useRouter();

    const uploadProfilePicture = () => {
        if (Img) {
            var formData = new FormData();
            formData.append("file", Img);
            uploadS3Document(Img, `profile/${empId}.jpeg` )
                .then((e) => {
                    toast.success("Profile Picture Uploaded")
                })
                .catch((err) => toast.error("unable to process request"))
        }
    }

    function handleFileInputChange(event) {
        const file = event.target.files[0];
        var formData = new FormData();
        formData.append("file", file);
        uploadS3Document(file, `/profile/${ParentState.auth._id}.jpeg`)
        .then((e) => {
            toast.success("Profile Picture Uploaded")
            router.reload()
        })
        .catch((err) => toast.error("unable to process request"))
        
      }

  return (
    <>
    <div className="profile_dropdown mt_2" >
        <div className="pr_item_main" >
            <h3>{`${ParentState?.auth.firstName} ${ParentState?.auth.lastName}`}</h3>
            <h3>{ParentState?.auth.designation} - {ParentState?.auth.department}</h3>
        </div>
        <div className="pr_item" onClick={()=> {
            router.push(`/admin/dashboard/employee/profile/edit/${ParentState?.auth._id}`)
            setProfileDropdown(false)
        }} >
            <MenuItem style={{display:"flex",gap:"10px"}} >
            <Description/>
            <h3>My Details</h3>
            </MenuItem>
        </div>
        <div className="pr_item" >
           <label htmlFor="file-input">
            <MenuItem style={{display:"flex",gap:"10px"}} >
                <AddAPhoto />
            <h3>Change Profile</h3>
            </MenuItem>
            <input type="file" id="file-input"  accept="image/png,image/jpeg"  onChange={handleFileInputChange} style={{ display: 'none' }}/>
            </label>
        </div>
        <div onClick={openSettings} className="pr_item" >
            <MenuItem style={{display:"flex",gap:"10px"}} >
                <Settings />
            <h3>Settings</h3>
            </MenuItem>
        </div>
    </div>
    </>
  )
}

export default ProfileDropdown