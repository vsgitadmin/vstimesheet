import React,{useEffect} from 'react'
import {getAllAttendance, createAttendance} from "../../../../src/Controllers/Attendance/index"
function attendence() {
    useEffect(() => {
        getAllAttendance()
        createAttendance({
          "hours": 6,
          "projectId":"213132141"
      })
    }, [])
    
  return (
    <div>attendence</div>
  )
}

export default attendence