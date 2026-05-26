import React from 'react'

function Form({onSubmit}) {
  return (
    <div>
        <form action="" onSubmit={onSubmit}>
            {/* <label htmlFor="">projectId </label>
            <input type="text" name="" id="" /> */}
            <br />
            <label htmlFor="">type </label>
            <label htmlFor="" style={{marginLeft:'20px'}}>Half Day</label>
            <input type='radio' value={'HD'}  id=""  name='type' />
            <label htmlFor="" style={{marginLeft:'20px'}}>Full Day</label>
            <input type='radio' value={'FD'}  id="" name='type' />
            <br />
            <label htmlFor="">note </label>
            <input type="text" name="note" id="" style={{marginLeft:'20px'}} />
            <br />

            <label htmlFor="" >StartDate </label>
            <input type="date" name="startDate" id="" style={{marginLeft:'20px'}} />
            <br />

            <label htmlFor="">EndDate </label>
            <input type="date" name="endDate" id="" style={{marginLeft:'20px'}} />
            <br />
            <button type='submit' >Submit </button>
        </form>
    </div>
  )
}

export default Form