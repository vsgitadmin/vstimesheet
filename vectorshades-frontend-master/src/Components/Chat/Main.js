import LeftSide from './LeftSide'
import ChatScreen from './ChatScreen'
import RightSide from './RightSide'
import styles from '../../../styles/Chat.module.css'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getGroupInfo, getChatList, createChatList, createChat, getAllGroups, getChatHistory, addNewGroupMember } from "../../Controllers/Chat/index"
import { getEmployeeSingleController } from '../../Controllers/Employee/index'

const Main = ({ ParentStore }) => {
  const [currentChat, setCurrentChat] = useState(null)
  const [isGroupChat, setIsGroupChat] = useState(false)
  const [groupData, setgroupData] = useState(null)
  const [chats, setChats] = useState([])
  const { ParentState, setParentState } = useContext(ParentStore)
  const [groups, setGroups] = useState([])
  const [messages, setMessages] = useState([])
  const [scollTb, setscollTb] = useState(true)
  //state for RightSide collapsable
  const [collapsable, setCollapsable] = useState(false)
  const [empData, setEmpData] = useState({})

  useEffect(() => {
    fetchChats()
    fetchGroups()
  }, [])

  // useEffect(() => {
  //   if (currentChat) {
  //     fetchMessages()
  //     fetchEmployeeInfo()
  //     if (isGroupChat) fetchGroupInfo()
  //   }
  // }, [currentChat])

  const addMemberToGroup = (selectedMember) => {
    addNewGroupMember(selectedMember, { id: currentChat._id }).then((res) => {
      fetchGroupInfo()
    }).catch((err) => {
      console.log(err);
      toast.error(err.message)
    })
  }

  const fetchGroupInfo = () => {
    getGroupInfo({ id: currentChat._id }).then((res) => {
      setgroupData(res.data.response);
    }).catch((err) => {
      console.log(err);
      toast.error(err.message)
    })
  }

  const fetchEmployeeInfo = async () => {
    if (!isGroupChat && currentChat) {
      getEmployeeSingleController(currentChat.employeeId)
        .then((response) => setEmpData(response.data.response.emp))
        .catch((errr) => toast("unable to process request"))
    }
  }

  const fetchChats = async () => {
    try {
      let res = await getChatList({ id: ParentState.auth._id })
      setChats(res.data.response.communications)
      return res.data.response.communications
    } catch (error) {
      console.log(error);
      return null
    }
  }

  const fetchMessages = () => {
    getChatHistory({ reciver: !isGroupChat ? currentChat.employeeId : currentChat._id, sender: ParentState.auth._id }).then((res) => {
      setMessages(res.data.response)
      setscollTb(!scollTb)
    }).catch((err) => {
      console.log(err);
    })
  }

  const createNewChat = async ({ reciver }) => {
    if (reciver == null || reciver == undefined) return
    createChatList({
      "employeeName": reciver.firstName + " " + reciver.lastName,
      "communications": [
        {
          "employeeName": reciver.firstName + " " + reciver.lastName,
          "employeeId": reciver._id
        }
      ]
    }).then(async (r) => {
      let fetchedChats = await fetchChats()
      let createdChat = fetchedChats.filter((chat) => { return chat.employeeId == reciver._id })
      if (createdChat.length != 0) setCurrentChat(createdChat[0])
    }).catch((e) => {
      console.log(e);
    })
  }

  const fetchGroups = () => {
    getAllGroups().then((res) => {
      setGroups(res.data.response)
    }).catch((err) => {
      console.log(err);
      toast.error(err.message)
    })
  }

  const selectNewUser = (user) => {
    const userObject = { employeeName: user.firstName + ' ' + user.lastName, employeeId: user._id }
    setMessages([])
    setCurrentChat(userObject)
    return userObject
  }

  const addNewMessage = ({ message }) => {
    createChat({
      "reciver": !isGroupChat ? currentChat.employeeId : currentChat._id,
      "group": isGroupChat,
      "type": "message",
      "message": message,
      "senderName": `${ParentState.auth.firstName} ${ParentState.auth.lastName}`,
      "reciverName": !isGroupChat ? currentChat.employeeName : currentChat.groupName
    }).then((res) => {
      console.log(res);
      fetchMessages()
    }).catch((err) => {
      console.log(err);
      toast.error(err.message)
    })
  }

  const reRender = () => {
    fetchChats()
    fetchGroups()
  }

  return (
    <section className={styles.chat_container}>
      <LeftSide selectNewUser={selectNewUser} render={reRender} parentState={ParentState} setIsGroupChat={setIsGroupChat} createChat={createNewChat} chats={chats} currentChat={currentChat} groups={groups} setCurrentChat={setCurrentChat} collapsable={collapsable} setCollapsable={setCollapsable} />
      <div className={styles.collapsable} >
        <ChatScreen key={currentChat} scollTb={scollTb} isGroupChat={isGroupChat} messages={messages} setCurrentChat={setCurrentChat} currentChat={currentChat} parentState={ParentState} addNewMessage={addNewMessage} collapsable={collapsable} setCollapsable={setCollapsable} />
        {collapsable && <RightSide employeeData={empData} addMemberToGroup={addMemberToGroup} currentChat={currentChat} isGroupChat={isGroupChat} groupData={groupData} collapsable={collapsable} setCollapsable={setCollapsable} />}
      </div>
    </section>
  )
}

export default Main