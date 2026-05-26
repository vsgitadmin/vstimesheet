import 'react-toastify/dist/ReactToastify.css';
import Otp from './Otp';
import { useState } from "react";
import { requestUpdatePasswordController, updatePasswordController } from "../../Controllers/Employee";
import { toast } from "react-toastify";
import Router, { useRouter } from "next/router";

const Loading = () => {
    return (<div className="loading">
        <span style={{ backgroundColor: 'red', padding: '5px' }}></span>
        <span style={{ backgroundColor: 'red', padding: '5px' }}></span>
        <span style={{ backgroundColor: 'red', padding: '5px' }}></span>
    </div>

    )
}

const ResetPassword = () => {

    const [codeRequested, setCodeRequested] = useState(false)
    const [email, setEmail] = useState()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        if (codeRequested) {
            let target = e.target
            let p1 = target[0].value, p2 = target[1].value,
                code = target[2].value + target[3].value + target[4].value + target[5].value

            if (p1 !== p2 || p1.length < 6) {
                toast(`${p1 !== p2 ? "Passwords must be same" : 'Passwords must be greater than 6 digits'}`)
                setLoading(false)
                return
            }

            if (code.length < 4) { toast("Enter correct code"); setLoading(false); return; }

            updatePasswordController({
                email, password: p1, code
            }).then((res) => {
                if (res.status === 200) {
                    toast("Password updated")
                    router.push('/auth/login')
                } else {
                    toast.error("Error updating password")
                }
            }).catch((err) => console.log(err)).finally(() => setLoading(false))


            //updatePasswordController({})
        } else {
            requestUpdatePasswordController({ email }).then((res) => {
                if(res.data && res?.data?.response?.data?.notOnboarded === true){
                    Router.push(`/activation?id=${res.data.response.data.activation}`)
                    toast("Employee Activation required before dashboard")
                }
                else if (res.status === 200) {
                    setCodeRequested(true)
                } else {
                    toast.error("Filed to send code")
                }
            }).catch((err) => {
                toast.error(err.message);
                console.log(err)
            }).finally(() => setLoading(false))
        }

    }

    return (<div className='login_main'>
        <div className="login_title">
            <h1>Secure Management Password</h1>
        </div>
        {loading && <Loading />}
        {!loading && <form onSubmit={handleFormSubmit}>
            {!codeRequested && <div className='login_input_group'>
                <label htmlFor="email">Email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} placeholder='Email' type="text"
                    name='email' autocomplete="new-password" />
            </div>}
            {codeRequested && <div className='login_input_group'>
                <input placeholder='Password' type="password"
                    name='email' autoComplete="new-password" />
                <input placeholder='confirm Password' type="password"
                    name='email' autoComplete="new-password" />
                <Otp onChange={(otp) => {
                }} />
            </div>}
            <div className="submit_button">
                <button type={'submit'}>Continue</button>
            </div>
        </form>}
    </div>)
}

export default ResetPassword