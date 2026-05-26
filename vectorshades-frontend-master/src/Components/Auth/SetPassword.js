import 'react-toastify/dist/ReactToastify.css';
import Pin from './Pin';
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {updatePasswordController} from "../../Controllers/Employee";

const Loading = () => {
    return (<div className="loading">
            <span></span>
            <span></span>
            <span></span>
        </div>

    )
}

const SetPassword = () => {

    const [token, setToken] = useState()
    const router = useRouter()

    const handleFormSubmit = (e) =>{
        e.preventDefault()
        let target = e.target
        let p1 = target[0].value
        let p2 = target[1].value
        if (token){
            if (p1===p2){
                if (p1.length >= 6){
                    let body = {
                        password:p1,
                        token
                    }
                    updatePasswordController(body).then((res)=>{
                        toast("Password update")
                        if (res.status===200){
                            router.push('/auth/login')
                        }else{
                            toast.error("Error in updating password")
                        }
                    }).catch((err)=>{toast.error(err.message);
                        console.log(err)})
                }else{
                    toast("Password length must be greater than 6")
                }
            }else {
                toast("Passwords must be same")
            }
        }else{
            toast("Cannot find token")
        }
    }

    useEffect(() => {
        if (router.query){
            if (router.query.key){
                setToken(router.query.key)
            }
        }
    }, [router.query]);

    return (<div className='login_main'>
            <div className="login_title">
                <h1>Secure Management Password</h1>
            </div>
            <form onSubmit={handleFormSubmit}>
                <div className='login_input_group'>
                    <label htmlFor="password">Password</label>
                    <input placeholder='Password' type="text" name='password' autocomplete="new-password"/>
                </div>
                <div className='login_input_group'>
                    <label htmlFor="confirm">Confirm Password</label>
                    <input placeholder='Confirm Password' type="password" name='confirm' autocomplete="new-password"/>
                </div>
                {/*<Pin/>*/}
                <div className="submit_button">
                    <button type={'submit'}>Set Password</button>
                </div>
            </form>
        </div>)
}

export default SetPassword