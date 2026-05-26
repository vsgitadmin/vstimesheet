import React, { useContext, useEffect, useState } from 'react'
import { general } from '../../../src/Helpers/index'
import Router from 'next/router'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ParentStore } from '../../_app';
import { getEmployeeController } from '../../../src/Controllers/Employee/index'
import { auth } from '../../../src/Constants/API/Endpoints';
import instance from '../../../src/Axios/Axios.config';
import LoginCard from '../../../src/Components/Auth/LoginCard';
import { generateToken, validateToken } from "../../../src/Helpers/General/JwtToken";
import { getConfigController } from '../../../src/Controllers/Config/index'
import { CircularProgress } from '@mui/material';

function Login() {
    const { ParentState, setParentState } = useContext(ParentStore)
    const [isLoading, setIsLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)

    const [loginLoading, setLoginLoading] = useState(false)
    const [employeeDataR, setEmployeeDataR] = useState()
    const [responseR, setResponseR] = useState()

    function loginuser(form) {
        form.preventDefault()
        setIsLoading(true)
        setParentState(null)
        const { email, password } = general.ExtractKeys(form, ["email", "password"])
        instance.get(auth.login, { params: { type: "cred", email: email, pwd: password, } })
            .then(async (response) => {
                const employeeData = await getEmployeeController(response.data.response.token)
                if (form.target[2].checked) localStorage.setItem("token", generateToken({ email, password }))
                if (employeeData.data.response.emp.onBoarded === false) {
                    Router.push(`/activation?id=${employeeData.data.response.emp.activationId}`)
                    toast("Employee Activation required before dashboard")
                } else {
                    toast.success('Login Successfull');
                    setEmployeeDataR(employeeData)
                    setResponseR(response)
                    setLoginLoading(true)
                }


                // let config = await getConfigController()
                // setParentState({ auth: { ...employeeData.data.response.emp, ...{ token: response.data.response.token } }, config: config.data.response.data })
                // sessionStorage.setItem('cache', true)
                // toast.success('Login Successfull');
                // Router.push('/admin/dashboard')
                // }
            })
            .catch((err) => {
                console.log(err);

                if (err.response) {
                    if (err.response.status === 400) {
                        setIsLoading(false)
                        toast.error('invalid credentials')
                    } else {
                        setIsLoading(false)
                        toast.error('error occured')
                    }
                } else {
                    setIsLoading(false)
                    toast.error('error occured')
                }
            })
    }

    let loginIn = false

    useEffect(() => {
        if (localStorage.getItem('token') !== null && loginIn === false) {
            let payload = validateToken(localStorage.getItem('token'))
            if (payload) {
                loginIn = true
                instance.get(auth.login, { params: { type: "cred", email: payload.email, pwd: payload.password, } })
                    .then(async (response) => {
                        const employeeData = await getEmployeeController(response.data.response.token)
                        toast.success('Login Successfull');
                        if (employeeData.data.response.emp.onBoarded === false) {
                            Router.push(`/activation?id=${employeeData.data.response.emp.activationId}`)
                            toast("Employee Activation required before dashboard")
                        } else {
                            Router.push('/admin/dashboard')
                            setParentState({ auth: { ...employeeData.data.response.emp, ...{ token: response.data.response.token } } })
                            sessionStorage.setItem('cache', true)
                        }
                        setPageLoading(false)
                    })
                    .catch((err) => {
                        setPageLoading(false)
                        setIsLoading(false)
                        if (err.response.status === 400) {
                            toast.error('invalid credentials')
                        } else {
                            toast.error('error occured')
                        }
                    }).finally(() => {
                        loginIn = false;
                    })
                return
            } else {
                localStorage.clear()
                setPageLoading(false)
            }
        } else {
            setPageLoading(false)
        }
    }, []);

    useEffect(() => {
        if (loginLoading) {
            setTimeout(async () => {
                let config = await getConfigController()
                setParentState({ auth: { ...employeeDataR.data.response.emp, ...{ token: responseR.data.response.token } }, config: config.data.response.data })
                sessionStorage.setItem('cache', true)
                Router.push('/admin/dashboard')
            }, 1500);
        }
    }, [loginLoading])

    return (
        <>
            {loginLoading && (<div className="login-animation">
                <h2>Welcome {employeeDataR.data.response.emp.firstName}!</h2>
            </div>)}
            <section className='auth_container'>
                <section className='left_section'></section>
                <section className='right_section'>
                    <LoginCard onSubmit={loginuser} isLoading={isLoading} pageLoading={pageLoading}
                        setPageLoading={setPageLoading} />
                </section>
            </section>
        </>
    )
}

export default Login