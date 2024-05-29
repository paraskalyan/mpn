"use client"
import { InputText } from 'primereact/inputtext';
import axios from "axios"
import { useEffect, useState } from "react"
import Table from "../_components/Table";

export default function View() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get('http://localhost:3000/api/table/')
            console.log(res.data)
            setData(res.data)
        }
        fetchData();
    }, [])

    const [value, setValue] = useState('');
    return (

        <div className='px-[100px] py-[20px]'>
            {/* <div>
                <InputText value={value} onChange={(e) => setValue(e.target.value)} />
            </div> */}

            <div className='flex w-full  items-center justify-between my-4 bg-blue-50 p-4 rounded-full'>
                <select className=' justify-self-start border px-3 py-2 outline-none focus:border-blue-300'>
                    <option className=''>Filter by category</option>
                    <option className=''>Electronics</option>
                    <option className=''>Mechanical</option>
                    <option className=''>Manufacturing</option>
                </select>
                <input placeholder='Search' className='outline-none px-3 border py-2 bg-gray-50 rounded-full focus:border-blue-300' />

                <button className='bg-blue-500 rounded-md text-white px-3 py-2'>Add New +</button>
            </div>
            <div className="bg-white w-full  text-black mt-5">

                <Table data={data} />

            </div>
        </div>
    )
}