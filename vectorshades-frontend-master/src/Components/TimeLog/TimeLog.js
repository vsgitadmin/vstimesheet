import { ArrowRightAlt } from '@mui/icons-material'
import React from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'

const TimeLog = () => {
  return (
    <div className='time_log_main' >
        <div className='time_log'>
            <div className='time_log_circle' >
             <CircularProgressbar
                value={62} 
                text={"62%"}
                strokeWidth={10}
                styles={{
                root: { width: '100%' },
                path: { stroke: '#E64848' },
                trail: { stroke: '#f0f0f0' },
                text: { fill: '#E64848', fontSize: '16px' },}}
                />
            </div>
            <div className='time_log_task'>
                <h5>Task Name</h5>
                <h5>2hr/8hr logged</h5>
            </div>
            <div className='time_log_arrow' >
                <ArrowRightAlt/>
            </div>
        </div>
    </div>
  )
}

export default TimeLog