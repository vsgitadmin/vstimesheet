import React, { useState } from 'react';

function CreateUser({ btn, details, btnaction }) {
  let [toogleform, settoogleform] = useState(false);

  return (
    <div className='createuser_parent'>
      <button className='createuser_btn' onClick={() => settoogleform(true)}>
        {btn}
      </button>

      {toogleform && <div className='popup'>
        <img src="/svg/worker.svg" alt="" />
        <form action="" onSubmit={btnaction}>
          {
            details.map((obj, i) =>
              <div key={i}>
                <label htmlFor="">{obj.label}</label>
                <input key={i} type={obj.type} name={obj.name} id="" />
              </div>
            )
          }
          <div className='popup_submit'>
            <button type={'submit'}>Submit</button>
          </div>
        </form>
        <p className='close_modal'> <span onClick={() => settoogleform(false)}>X</span> </p>
      </div>}
    </div>
  );
}

export default CreateUser;
