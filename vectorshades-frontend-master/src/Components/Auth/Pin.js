import React from 'react'

const Pin = () => {
  return (
    <div className='pin_container' >
            <div>
              <label>Secure Pin</label>
              <p>Enter your secure 4 digit pin here</p>
            </div>
            <div>
            <input type="password"  maxLength="1" />
            <input type="password"  maxLength="1"  />
            <input type="password"  maxLength="1"  />
            <input type="password"  maxLength="1"  />
            </div>
    </div>
  )
}

export default Pin