import { EditOutlined, InfoOutlined } from '@mui/icons-material'
import { useState } from 'react'
import { useRouter } from 'next/router'

const VerticalCards = ({data,enableEditPopup}) => {
  const { jobData, jobData: { total_breakpoints } } = data
  const date = new Date(data.date).toString().split(" ").slice(1, 3).join(" ")
  const estimatedDate = new Date(jobData.estimate).toString().split(" ").slice(1, 3).join(" ")
  const [notesOpen, setNotesOpen] = useState(false)
  const router = useRouter()

  const openProject = () => {
    if (!data.projectId) return
    router.push(`/admin/dashboard/projects/${data.projectId}`)
  }

  return (
    <>
      <div className={`vertical_card ${data.projectId ? 'vertical_card_clickable' : ''}`} onClick={openProject} title={data.projectId ? 'Open project' : undefined} >
       <div onClick={(e) => { e.stopPropagation(); enableEditPopup(data) }} className="vertical_card_edit" >
         <EditOutlined fontSize='small'/>
       </div>
       {data.notes && (
         <div onClick={(e) => { e.stopPropagation(); setNotesOpen((open) => !open) }} className="vertical_card_notes_btn" title="View notes" >
           <InfoOutlined fontSize='small'/>
         </div>
       )}
       {notesOpen && data.notes && (
         <div className="vertical_card_notes_popover" onClick={(e) => e.stopPropagation()} >
           <h5>Notes</h5>
           <p>{data.notes}</p>
         </div>
       )}
        <div className="vertical_titles_main" >
          <div className="vertical_titles" >
            <h5>Client Name</h5>
            <h5>{jobData.client}</h5>
          </div>
          <div className="vertical_titles" >
            <h5>Project Name</h5>
            <h5>{jobData.project}</h5>
          </div>
          <div className="vertical_titles" >
            <h5>Job Number</h5>
            <h5>{data.jobNumber}</h5>
          </div>
          <div className="vertical_titles" >
            <h5>Date</h5>
            <h5>{date}</h5>
          </div>
        </div>
        <div className="vertical_cards_boxes" >
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Location</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{data.location}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Tonnage</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{data.tonnage}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Engineering</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{jobData.engineering_fee}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Hours</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{total_breakpoints?.hours}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Per Hour Cost</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{total_breakpoints?.bid_hour}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Hours</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{total_breakpoints?.hours}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>$PH</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>16</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Bid Price</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{total_breakpoints?.bid}</h5>
            </div>
         </div>
         <div className="vertical_cards_box" >
            <div className="vertical_cards_heading" >
             <h5>Cost</h5>
            </div>
            <div className="vertical_cards_heading_value" >
              <h5>{total_breakpoints?.total_cost}</h5>
            </div>
         </div>
        </div>
      </div>
    </>
  )
}

export default VerticalCards