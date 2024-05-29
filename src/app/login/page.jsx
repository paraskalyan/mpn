"use client"
import axios from "axios"
import { useState } from "react"
import Router from "next/router"

export default function Login({ setLoggedIn }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')



    const handleSignIn = async () => {
        const res = await axios.post('http://localhost:3000/api/userExist/', { username, password })
        if (res) {
            if (res.status === 200) {
                setLoggedIn(true)
            }
        }
    }

    return (
        <div className="flex items-center justify-center flex-col h-[100vh] gap-2 bg-gray-100">
            <h1 className="text-[2.4rem] font-bold my-5">
                Log in to proceed
            </h1>
            <div className="flex flex-col gap-2">

                <input className="border p-2 outline-none " value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter username" />
                <input className="border p-2 outline-none " value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                <button className="bg-green-500 px-5 mt-3  py-2 text-white hover:bg-green-700" onClick={handleSignIn}>Sign in</button>
            </div>
        </div>
    )
}