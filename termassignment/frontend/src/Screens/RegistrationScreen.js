import React,{useState} from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

import axios from 'axios'

const RegistrationScreen = () => {

    const [fname,setFname] = useState("")
    const [lname,setLname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [confirm,setConfirm] = useState("")
    const [error,setError] = useState("")
    
    const registerHandler = async() => {
        setError("")
        
        if(confirm !== password){
            setError("Password did not match")
        }else{
            var req = {
                fname,
                lname,
                email,
                password
            }
            await axios.post(`${process.env.REACT_APP_API_GATEWAY}/register`,req).then((res)=>{
                window.location.href = '/login'
            }).catch((error)=>{
                console.log(error)
            })
            // console.log(req)
        }
    }
    return (
        <main className='p-3 d-flex flex-column justify-content-center align-items-center'>
            <h2>Register</h2>
            <div className='m-2 mt-4'>
                <TextField id="outlined-basic" label="First name" variant="outlined" value={fname} onChange={(e)=>setFname(e.target.value)} />
            </div>
            <div className='m-2'>
                <TextField id="outlined-basic" label="Last name" variant="outlined" value={lname} onChange={(e)=>setLname(e.target.value)} />
            </div>
            <div className='m-2'>
                <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className='m-2'>
                <TextField id="outlined-basic" label="Password" variant="outlined" type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
            </div>
            <div className='m-2'>
                <TextField id="outlined-basic" label="Confirm" variant="outlined" type='password' value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
            </div>
            <div className='m-2'>
                <Button variant="contained" onClick={registerHandler}>Register</Button>
            </div>
            <div className='m-2'>
                <Button variant="outline" onClick={()=>window.location = "/login"}>Already a user?</Button>
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

export default RegistrationScreen
