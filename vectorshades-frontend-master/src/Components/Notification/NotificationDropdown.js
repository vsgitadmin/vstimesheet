import Link from 'next/link';
import { Avatar } from '@mui/material';
import ProfileImage from '../ProfileImage/Image'
import { useRouter } from 'next/router';
import { NotificationImportantOutlined } from '@mui/icons-material';

const NotificationDropdown = ({ data, unseen, setNotificationDrop }) => {
   const router = useRouter()
   return (
      <div className="notification_dropdown" >
         <div className="noti_drop_heading" >
            <h3>Notifications</h3>
         </div>
         <div className="noti_drop_main" >
            <div className="noti_body" >
               {data.map(({ text, createdAt, link, reciever }) => {
                  const date = new Date(createdAt).toDateString()
                  return (
                     <div className="noti_drop_box" onClick={() => router.push(link)} >
                        <div className="noti_drop_det" >
                           <div className="noti_icon" >
                              <NotificationImportantOutlined/>
                           </div>
                           <div className="noti_message" >
                              <p>{text}</p>
                              <h5>{date}</h5>
                           </div>
                        </div>
                     </div>
                  )
               })}
            </div>
            <div onClick={() => {
               router.push("/admin/dashboard/notifications")
               setNotificationDrop(false)
            }} className="see_more" >
               <h5>View all Notifications</h5>
            </div>
         </div>
      </div>
   )
}

export default NotificationDropdown