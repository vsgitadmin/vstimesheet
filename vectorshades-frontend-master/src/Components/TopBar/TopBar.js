import { HandymanOutlined, Logout, Notifications, Person2Outlined } from '@mui/icons-material'
import { useContext, useState, useEffect, useRef } from 'react';
import { ParentStore } from '../../../pages/_app';
import { Badge, Tooltip } from '@mui/material'
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { getUserNotifications } from '../../Controllers/Communication/index'
import { performEmployeeLogoutController } from '../../Controllers/Employee/index'
import LogoutInProgressTasksPopup from '../Popups/General/LogoutInProgressTasksPopup'
import { getSocketIoServerUrl } from '../../Constants/Servers';
import io from 'socket.io-client';
import ProfileImage from '../ProfileImage/Image';
import styles from '../../../styles/Reports.module.css'
import SideBarProfilePopup from '../Popups/Hr/SideBarProfilePopup';
import NotificationDropdown from '../Notification/NotificationDropdown';
import OutsideClickHandler from 'react-outside-click-handler';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';

const TopBar = ({ openSettings }) => {
  let { ParentState, setParentState } = useContext(ParentStore);
  const router = useRouter();
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationDrop, setNotificationDrop] = useState(false);
  const [NotificationData, setNotificationData] = useState([]);
  const socketRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [scrollDown, setScrollDown] = useState(false);
  const [unReadCount, setunReadCount] = useState(0);
  const [logoutBlockedPopup, setLogoutBlockedPopup] = useState(false);
  const [logoutBlockedTasks, setLogoutBlockedTasks] = useState([]);
  const [logoutChecking, setLogoutChecking] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const userId = ParentState?.auth?._id;
    const token = ParentState?.auth?.token;

    if (!userId) return;

    const socketBaseUrl = getSocketIoServerUrl();
    const socketInstance = io(socketBaseUrl, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: token ? { token } : undefined
    });

    socketRef.current = socketInstance;

    const registerId = () => {
      try {
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('updateID', { user: userId, id: socketRef.current.id });
        }
      } catch (e) {
        console.error(e);
      }
    };

    const onConnect = () => {
      setSocketConnected(true);
      registerId();
    };

    const onReconnect = () => {
      setSocketConnected(true);
      registerId();
    };

    const onConnectError = (err) => {
      setSocketConnected(false);
      console.warn('socket connect_error', err?.message || err);
    };

    const onConnectTimeout = (timeout) => {
      setSocketConnected(false);
      console.warn('socket connect_timeout', timeout);
    };

    const onDisconnect = (reason) => {
      setSocketConnected(false);
      if (reason === 'io server disconnect') {
        socketInstance.connect();
      }
    };

    socketInstance.on('connect', onConnect);
    socketInstance.on('reconnect', onReconnect);
    socketInstance.on('connect_error', onConnectError);
    socketInstance.on('connect_timeout', onConnectTimeout);
    socketInstance.on('disconnect', onDisconnect);

    const onNotification = (data) => {
      if (String(data.reciever) === String(userId)) {
        toast.info(data.text);
        setNotificationData(e => [data, ...e]);
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(data.text, {
            body: 'Please Access Timesheet for more details',
            tag: 'Vectorshades Timesheet'
          });
        }
      }
    };
    socketInstance.on('notification', onNotification);

    getNotifications({});

    return () => {
      setSocketConnected(false);
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('reconnect', onReconnect);
        socketRef.current.off('connect_error', onConnectError);
        socketRef.current.off('connect_timeout', onConnectTimeout);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.off('notification', onNotification);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [ParentState?.auth?._id, ParentState?.auth?.token]);

  useEffect(() => {
    if (notificationDrop === true) {
      localStorage.setItem('last_checked', new Date());
      setunReadCount(0);
    }
  }, [notificationDrop]);

  useEffect(() => {
    if (NotificationData.length > 0) {
      const lastChecked = localStorage.getItem('last_checked');
      let unseen;
      if (lastChecked) {
        unseen = NotificationData.filter(
          (data) => new Date(data.createdAt) > new Date(lastChecked)
        );
      } else {
        unseen = NotificationData;
      }
      setunReadCount(Array.isArray(unseen) ? unseen.length : 0);
    }
  }, [NotificationData]);

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset;
    if (scrollPosition > 0) {
      setScrollDown(true);
    } else {
      setScrollDown(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const completeLogout = () => {
    toast.success('Logging out of the account');
    sessionStorage.removeItem('cache');
    setLogoutBlockedPopup(false);
    setLogoutBlockedTasks([]);
    setTimeout(() => {
      router.push('/auth/login');
      setParentState(null);
    }, 1000);
  };

  const logOutFunction = async () => {
    try {
      setLogoutChecking(true);
      await performEmployeeLogoutController();
      completeLogout();
    } catch (err) {
      if (err?.blocked) {
        setLogoutBlockedTasks(err.inProgressTasks || []);
        setLogoutBlockedPopup(true);
        return;
      }
      toast.error(err?.response?.data?.message || err?.message || 'Logout failed');
    } finally {
      setLogoutChecking(false);
    }
  };

  const retryLogoutAfterPause = async () => {
    try {
      setLogoutChecking(true);
      await performEmployeeLogoutController();
      completeLogout();
    } catch (err) {
      if (err?.blocked) {
        setLogoutBlockedTasks(err.inProgressTasks || []);
        toast.info('Pause all in-progress tasks, then try again.');
        return;
      }
      toast.error(err?.response?.data?.message || err?.message || 'Logout failed');
    } finally {
      setLogoutChecking(false);
    }
  };

  const getNotifications = async (query) => {
    try {
      const { data } = await getUserNotifications(query);
      setNotificationData(data.response.data);
      return;
    } catch (err) {
      toast.error(err.message);
    }
  };

  const Role = () => {
    const roleMappings = {
      RB: 'Rebar',
      SA: 'Super Admin',
      HR: 'Human Resources',
      EMP: 'Employee',
      STL: 'Steel',
      PA: 'Project Admin',
    };
    const code = ParentState?.auth?.role;
    const roleName = roleMappings[code] || 'Unknown Role';
    return roleName;
  };

  function formatMinutes(minutes) {
    if (minutes < 0) return "Invalid input";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = parseInt(minutes % 60);
    let formattedTime = "";
    if (hours > 0) formattedTime += `${hours}h `;
    if (remainingMinutes > 0 || hours === 0) formattedTime += `${remainingMinutes}m`;
    return formattedTime.trim();
  }

  return (
    <>
      <LogoutInProgressTasksPopup
        open={logoutBlockedPopup}
        onClose={() => setLogoutBlockedPopup(false)}
        tasks={logoutBlockedTasks}
        onRecheck={retryLogoutAfterPause}
        checking={logoutChecking}
      />
      <div id='top_bar' className={`${styles.rp_top_bar} ${scrollDown ? styles.rp_top_bar_hidden : ''}`}>
        <div className={styles.rp_top_right} >
          <div className={styles.rp_round} onClick={logOutFunction} style={{ cursor: "pointer" }} ><Logout /></div>
          <OutsideClickHandler onOutsideClick={() => setNotificationDrop(false)} >
            <div style={{ cursor: "pointer" }} className={styles.rp_round} onClick={() => setNotificationDrop(prev => !prev)} >
              <Badge color="error" badgeContent={unReadCount} >
                <Notifications />
              </Badge>
            </div>
            {notificationDrop && <NotificationDropdown unseen={unReadCount} data={NotificationData} notificationDrop={notificationDrop} setNotificationDrop={setNotificationDrop} />}
          </OutsideClickHandler>

          <OutsideClickHandler onOutsideClick={() => { }}>
            <div className='sidebar_badge' style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tooltip style={{ width: "100%" }} title="Logged in time">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 'max-content' }}>
                  <Person2Outlined style={{ fill: "red" }} />
                  <span style={{ fontWeight: "bold", color: "black", marginLeft: "5px", width: 'max-content' }}>
                    {ParentState?.auth.todayLoged > 1440 ? '---' : formatMinutes(ParentState?.auth.todayLoged)}
                  </span>
                </div>
              </Tooltip>
              <div style={{ width: "2px", height: "80%", background: "#00000040" }} />
              <Tooltip style={{ width: "100%" }} title="Task Worked Time">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: 'max-content' }}>
                  <HandymanOutlined style={{ fill: "red" }} />
                  <span style={{ fontWeight: "bold", color: "black", marginLeft: "5px", width: 'max-content' }}>
                    {ParentState?.auth.taskTime > 1440 ? '---' : formatMinutes(ParentState?.auth.taskTime)}
                  </span>
                </div>
              </Tooltip>
            </div>
            {profileDropdown && <ProfileDropdown setProfileDropdown={setProfileDropdown} />}
          </OutsideClickHandler>

          <OutsideClickHandler onOutsideClick={() => setProfileDropdown(false)} >
            <div className='sidebar_badge' onClick={() => setProfileDropdown(prev => !prev)} >
              <Tooltip title={socketConnected ? 'Live updates connected' : 'Live updates disconnected — check network or socket server'}>
                <div
                  className={`${styles.rp_profile_socket_wrap} ${socketConnected ? styles.rp_socket_online_ring : ''}`}
                >
                  <ProfileImage id={ParentState?.auth?._id} />
                  {socketConnected ? <span className={styles.rp_socket_online_dot} aria-hidden /> : null}
                </div>
              </Tooltip>
              <div>
                <h4>{`${ParentState?.auth.firstName} ${ParentState?.auth.lastName}`}</h4>
                <h5><Role /></h5>
              </div>
            </div>
            {profileDropdown && <ProfileDropdown setProfileDropdown={setProfileDropdown} openSettings={openSettings} />}
          </OutsideClickHandler>
        </div>
      </div>
    </>
  )
}

export default TopBar
