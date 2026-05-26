import { toast } from 'react-toastify';
import ProfileImage from '../ProfileImage/Image';

const CustomNotification = ({userImg,userName,message}) => {
  return (
    <div className='notification_alert' >
      <div>
        <ProfileImage id={userImg} />
        <p>{userName}</p>
      </div>
      <div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export const notificationAlert = (userImg,userName,message) => {
  toast(<CustomNotification userImg={userImg} userName={userName} message={message} />, {
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

export default CustomNotification;
