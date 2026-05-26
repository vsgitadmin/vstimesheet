import { Typography } from "@mui/material";
import styles from "../../../../styles/Settings.module.css";
import ReplayIcon from '@mui/icons-material/Replay';
import { generateTimerTokenController } from "../../../Controllers/Employee";
import { toast } from "react-toastify";
import { useContext, useState } from "react";
import { ParentStore } from "../../../../pages/_app";

function SettingPopup({ open, onClose }) {
  const { ParentState } = useContext(ParentStore)
  const [token, settoken] = useState(ParentState?.auth?.timerToken)

  const generateTimerTokenFunction = async () => {
    settoken('')
    const { data } = await generateTimerTokenController()
    settoken(data.response.token)
    toast.success('Token Refreshed Successfully')
  }

  if (!open) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} >
      <div
        onClick={(e) => e.stopPropagation()} // Prevent click from closing the popup
        className={styles.setting_popup}
      >
        <Typography variant="h5" fontWeight={500} >Settings</Typography>

        <Typography marginTop={1} variant="p" fontSize={14} fontWeight={400} >Generate Token - Value changes are not visible</Typography>
        <div>
          <input type="text" key={token} value={token} />
          <button onClick={generateTimerTokenFunction}><ReplayIcon /></button>
        </div>
      </div>
    </div>
  );
}

export default SettingPopup;
