import React,{useState, useContext} from 'react'
import {Context} from '../Auth/JWTAuth'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import axios from 'axios'

const LoginScreen = () => {
    const { loginUser,logoutUser, token, setToken } = useContext(Context)

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState("")

    const loginHandler = async () => {
        setError("")
    
        var req = {
            email,
            password
        }
        await axios.post(`${process.env.REACT_APP_API_GATEWAY}/login`,req).then((res)=>{
            loginUser(res.data)
            window.location.href = '/home'
        }).catch((error)=>{
            console.log(error)
        })
    }

    return (
        <main className='p-3 d-flex flex-column justify-content-center align-items-center'>
            <h2>Login</h2>
            <div className='m-2 mt-4'>
                <TextField id="outlined-basic" label="Email" variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='m-2'>
                <TextField id="outlined-basic" label="Password" variant="outlined" type='password' onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className='m-2'>
                <Button variant="contained" onClick={loginHandler}>Login</Button>
            </div>
            <div className='m-2'>
                <Button variant="outline" onClick={()=>window.location = "/registration"}>Not a user?</Button>
            </div>
            {
                error !== "" && 
                <div className='m-2'>
                    <Alert severity="error">{error}</Alert>
                </div>
            }
        </main>
    )
}

export default LoginScreen
