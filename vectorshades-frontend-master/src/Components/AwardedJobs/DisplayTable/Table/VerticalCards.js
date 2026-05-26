import { EditOutlined } from '@mui/icons-material'

const VerticalCards = ({data,enableEditPopup}) => {
  const { jobData, jobData: { total_breakpoints } } = data
  const date = new Date(data.date).toString().split(" ").slice(1, 3).join(" ")
  const estimatedDate = new Date(jobData.estimate).toString().split(" ").slice(1, 3).join(" ")

  return (
    <>
      <div className="vertical_card" >
       <div onClick={() => enableEditPopup(data)} className="vertical_card_edit" >
         <EditOutlined fontSize='small'/>
       </div>
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