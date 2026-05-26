import {general} from '../../../../Helpers/index'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const VerticalCards = ({data,enableEditPopup}) => {
    const {DateToMonthYear} = general;
  return (
    <>
    <div className="vertical_cards_main" >
      {data.map((data)=>{
         const awardData = data.awardedProjectData
         const jobData = awardData.jobData
        return(
            <div className="vertical_card" >
                <div onClick={() => enableEditPopup(data)} className="vertical_card_edit" >
                    <EditOutlinedIcon fontSize='small'/>
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
                 <h5>Awarded Project</h5>
                 <h5>{DateToMonthYear(awardData.date)}</h5>
                </div>
                <div className="vertical_titles" >
                 <h5>Location	</h5>
                 <h5>{awardData.location}</h5>
                </div>
               </div>

              <div className="vertical_cards_boxes" >
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Job No</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{awardData.jobNumber}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>PO Price</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.po_price}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>CO Price</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.co_price}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Billed</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.billed}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Billing Backlog</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.billing_backlog}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>OFA Backlog</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.OFABacklog}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Fab Backlog</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.FABBacklog}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Bid Hours</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.bidHours}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>CO Hours</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.co_hours}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Used Hours</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.usedHours}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Backlog Hrs</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.backlogHours}</h5>
                 </div>
               </div>
               <div className="vertical_cards_box" >
                 <div className="vertical_cards_heading" >
                  <h5>Est Final Balance</h5>
                 </div>
                 <div className="vertical_cards_heading_value" >
                  <h5>{data.finalBalance}</h5>
                 </div>
               </div>
              </div>
           </div>
        )
      })}
    </div>
    </>
  )
}

export default VerticalCards

