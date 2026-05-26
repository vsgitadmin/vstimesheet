

import ProfileImage from '../ProfileImage/Image'
import styles from '../../../styles/Chat.module.css'
import { AttachFile, DoneAll, ExpandMore, Image, Send, TagFaces } from '@mui/icons-material'
import { Chip, Divider, Tooltip } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import { timeTohhmm } from "../../Helpers/General/Time"
import ShareAppDataPopup from '../Popups/General/ShareAppDataPopup'

const ChatLoading = () => {
  return (
    <div className={styles.loading}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )
}

const AttachDrop = ({setShareAppDataPopup}) => {
  return (
    <div className={styles.attach_drop} >
      <Tooltip title="Image & Videos" >
        <div className={styles.attach_drop_item} >
          <img src="https://cdn-icons-png.flaticon.com/128/10530/10530688.png" alt="" />
        </div>
      </Tooltip>
      <Tooltip title="Document" >
        <div className={styles.attach_drop_item} >
          <img src="https://cdn-icons-png.flaticon.com/128/9385/9385278.png" alt="" />
        </div>
      </Tooltip>
      <Tooltip title="Attendace" >
        <div className={styles.attach_drop_item} >
          <img src="https://cdn-icons-png.flaticon.com/128/10614/10614808.png" alt="" />
        </div>
      </Tooltip>
      <Tooltip title="Task" >
        <div className={styles.attach_drop_item} >
          <img src="https://cdn-icons-png.flaticon.com/128/3334/3334145.png" alt="" />
        </div>
      </Tooltip>
      <Tooltip title="Share App Data" >
        <div onClick={() => setShareAppDataPopup(true)} className={styles.attach_drop_item} >
          <img src="https://cdn-icons-png.flaticon.com/128/4206/4206337.png" alt="" />
        </div>
      </Tooltip>

    </div>
  )
}

const ChatMain = ({ currentChat, parentState, addNewMessage, messages, isGroupChat, scollTb, collapsable, setCollapsable }) => {

  const [attachDrop, setAttachDrop] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const [shareAppDataPopup, setShareAppDataPopup] = useState(false)

  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [scollTb])

  return (
    <div className={styles.chat_screen} style={{width: collapsable && "70%"}} >
      <div onClick={()=> setCollapsable(true)} className={styles.chat_screen_top_box} >
        {currentChat ? <>
          < ProfileImage key={currentChat} id={!isGroupChat ? currentChat?.employeeId : ""} size={40} />
          <div>
            <h4>{!isGroupChat ? currentChat?.employeeName : currentChat.groupName}</h4>
            <h5><span>{timeTohhmm(currentChat?.updatedAt)}</span> 4 Online</h5>
          </div>
        </> : "No chat selected"}
      </div>
      <div className={styles.chat_main_screen} >
        <div className={styles.main_screen} id='chats_main' ref={containerRef}>
          {messages.map((msg) => {
            if (!isGroupChat) {
              if (msg.employeeId != currentChat?.employeeId) return <>
                <div className={styles.right_chat_container} >
                  <div className={styles.right_chat_details} >
                    <h3>You</h3>
                    <span>{timeTohhmm(msg.updatedAt)} <DoneAll style={{ fill: "skyblue" }} /></span>
                  </div>
                  <div className={styles.chat_message_right} >
                    <p>{msg.message}</p>
                  </div>
                </div>
              </>
              else return <>
                <div className={styles.left_chat_main_container} >
                  <ProfileImage id={msg.employeeId} size={40} />
                  <div className={styles.left_chat_container} >
                    <div className={styles.left_chat_details} >
                      <h3>{currentChat?.employeeName}</h3>
                      <span>{timeTohhmm(msg.updatedAt)}</span>
                    </div>
                    <div className={styles.chat_message_left} >
                      <p>{msg.message}</p>
                    </div>
                  </div>
                </div>
              </>
            } else {
              if (msg.employeeId != parentState.auth._id) return <div className={styles.left_chat_main_container} >
                <ProfileImage id={msg.employeeId} size={40} />
                <div className={styles.left_chat_container} >
                  <div className={styles.left_chat_details} >
                    <h3>{msg.senderName}</h3>
                    <span>{timeTohhmm(msg.updatedAt)}</span>
                  </div>
                  <div className={styles.chat_message_left} >
                    <p>{msg.message}</p>
                  </div>
                </div>
              </div>
              else return <>
                <div className={styles.right_chat_container} >
                  <div className={styles.right_chat_details} >
                    <h3>You</h3>
                    <span>{timeTohhmm(msg.updatedAt)} <DoneAll style={{ fill: "skyblue" }} /></span>
                  </div>
                  <div className={styles.chat_message_right} >
                    <p>{msg.message}</p>
                  </div>
                </div>
              </>
            }

          })}

        </div>
      </div>

      {/* chat input */}
      <div className={styles.chat_screen_bottom} >
        {currentChat && <div className={styles.chat_screen_bottom_child} >
          <input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} type="text" placeholder='Type a message' />
          <OutsideClickHandler onOutsideClick={() => setAttachDrop(false)} >
            {attachDrop && <AttachDrop setShareAppDataPopup={setShareAppDataPopup} />}
            <TagFaces  />
            <AttachFile onClick={() => setAttachDrop(prev => !prev)} />
            <Send onClick={() => { addNewMessage({ message: inputMessage }); setInputMessage('') }} />
          </OutsideClickHandler>
        </div>}
      </div>

      {/* <div className={styles.go_down} >
        <ExpandMore />
      </div> */}

      <ShareAppDataPopup shareAppDataPopup={shareAppDataPopup} setShareAppDataPopup={setShareAppDataPopup} />

    </div>
  )
}

export default ChatMain