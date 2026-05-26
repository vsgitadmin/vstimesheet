import Link from 'next/link';
import React from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Otp from './Otp';
import {Box} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return(
   <div className="loading">
    <span></span>
    <span></span>
    <span></span>
  </div>

  )
}

function LoginCard({onSubmit, isLoading, pageLoading,setPageLoading}) {
  return (
    <div className='login_main' >
      <div className="login_title" style={{display:'flex'}}>
          <h1>{!pageLoading?<>Login to <br />VectorShades Management</>:"Just a sec"}</h1>
          {pageLoading &&<Box sx={{display:'flex',ml:3}}>
              <CircularProgress/>
          </Box>}
      </div>

        {!pageLoading&&<form onSubmit={onSubmit}>
            <div className='login_input_group'>
                <label htmlFor="email">Email</label>
                <input placeholder='mail@website.com' type="text" name='email'/>
            </div>
            <div className='login_input_group'>
                <label htmlFor="password">Password</label>
                <input placeholder='Min. 8 character' type="password" name='password'/>
            </div>
            <div className='forget_pass'>
                <div>
                    <input name="save" type="checkbox"/>
                    <label>Remember me</label>
                </div>
                <Link href="/auth/password/forget">Forget password?</Link>
            </div>
            {/*<Otp/>*/}
            <div className="submit_button">
                <button type={'submit'}>{isLoading ? <Loading/> : "Log In"}</button>
            </div>
        </form>}
    </div>
  )
}

export default LoginCard