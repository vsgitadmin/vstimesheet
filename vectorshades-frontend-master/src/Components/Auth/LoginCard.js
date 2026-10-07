import Link from 'next/link';
import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import Otp from './Otp';
import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const Loading = () => {
  return (
    <div className="loading">
      <span></span>
      <span></span>
      <span></span>
    </div>

  )
}

function LoginCard({ onSubmit, isLoading, pageLoading, setPageLoading }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='login_main'>
      <img src="/logo/vs-logo.png" className="login_logo_mobile" alt="VectorShades" />

      <div className="login_title">
        {!pageLoading ? (
          <>
            <span className="login_eyebrow">Welcome back</span>
            <h1>Login to <span>VectorShades</span> Management</h1>
            <p className="login_subtitle">Enter your credentials to access your dashboard</p>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <h1>Just a sec</h1>
            <CircularProgress size={26} sx={{ color: 'var(--redTheme)' }} />
          </Box>
        )}
      </div>

      {!pageLoading && <form onSubmit={onSubmit}>
        <div className='login_input_group'>
          <label htmlFor="email">Email</label>
          <div className="input_with_icon">
            <MailOutlineRoundedIcon className="input_icon" />
            <input placeholder='name@vectorshades.com' type="text" name='email' id="email" autoComplete="username" />
          </div>
        </div>
        <div className='login_input_group'>
          <label htmlFor="password">Password</label>
          <div className="input_with_icon">
            <LockOutlinedIcon className="input_icon" />
            <input
              placeholder='Enter your password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              id="password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="toggle_password"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
            </button>
          </div>
        </div>
        <div className='forget_pass'>
          <div>
            <input name="save" type="checkbox" id="save" />
            <label htmlFor="save">Remember me</label>
          </div>
          <Link href="/auth/password/forget">Forget password?</Link>
        </div>
        {/*<Otp/>*/}
        <div className="submit_button">
          <button type={'submit'} disabled={isLoading}>{isLoading ? <Loading /> : "Log In"}</button>
        </div>
      </form>}
    </div>
  )
}

export default LoginCard
