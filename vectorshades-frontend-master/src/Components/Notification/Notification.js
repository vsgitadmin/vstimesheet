import { Avatar } from '@mui/material'
import Router from 'next/router'
import ProfileImage from '../ProfileImage/Image'

const Notification = ({ data }) => {
   return (
      <>
         <div className="notifications_page" >
            <div className="notifications_heading" >
               <h1>Notifications</h1>
            </div>
            <div className="notifications_main" >
               {data.map((notification) => {
                  return (
                     <div className="notifications_box" onClick={() => Router.push(notification.link)}>
                        <div className="notification_drop_det" >
                           <div className="noti_message" >
                              <p>{notification.text}</p>
                           </div>
                        </div>
                        <div className="notification_timeline" >
                           <h5>{new Date(notification.createdAt).toLocaleDateString()} - {new Date(notification.createdAt).toLocaleTimeString()}</h5>
                        </div>
                     </div>
                  )
               })}
            </div>
         </div>
      </>
   )
}

export default Notification