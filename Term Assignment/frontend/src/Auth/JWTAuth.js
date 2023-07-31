import React, { createContext, useState, useEffect } from "react"

export const Context  = createContext()

export const Provider = ({children}) => {

    const [loggedIn,setLoggedIn] =  useState(()=>{
        return parseInt(localStorage.getItem('loggedIn')) || false
    })

    const [token,setToken] = useState(()=>{
        return localStorage.getItem('token') || ""
    })

    useEffect(()=>{
        localStorage.setItem('loggedIn',loggedIn.toString())
        localStorage.setItem('token',token)
    },[])

    const loginUser = (jwt_token) => {
        console.log("New token"+jwt_token)
        setLoggedIn(true)
        setToken(jwt_token)
        localStorage.setItem('loggedIn',"1")
        localStorage.setItem('token',jwt_token)
    }

    const logoutUser = () => {
        setLoggedIn(false)
        setToken("")
        localStorage.setItem('loggedIn',"0")
        localStorage.setItem('token',"")
    }

    return (
        <Context.Provider value={{loginUser,logoutUser, token, setToken}}>
            {children}
        </Context.Provider>
    )
}

export const MemoizedProvider = React.memo(Provider);