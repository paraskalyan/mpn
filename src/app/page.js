"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CreateCategory from "./_components/CreateCategory";
import { Dropdown } from "primereact/dropdown";
import { Autocomplete, TextField } from "@mui/material";
import CategoryDropdown from "./_components/CategoryDropdown";
import Login from "./login/page";

export default function Home() {
  const [mpn, setMpn] = useState('');
  const [make, setMake] = useState('');
  const [existString, setExistString] = useState('')
  const [existMessage, setExistMessage] = useState(false)
  const [data, setData] = useState(null)
  const [catWindowVisible, setCatWindowVisible] = useState(false)

  const [subcategories, setSubcategories] = useState([]);

  const [makes, setMakes] = useState([])

  const [choosenCategory, setChoosenCategory] = useState('')
  const [choosenSubcategory, setChoosenSubcategory] = useState('')

  const [loggedIn, setLoggedIn] = useState(false)


  var subcatDigits = 2;
  var categoryNumber = 0;
  var subcategoryNumber = 0;



  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('/api/mpn/', {
        params: { mpn, make },
        cache: "no-store"
      });

      if (res.data != null) {
        // console.log(res.data)
        setData(res.data)

        setExistString('MPN and MAKE already exists. Part number: ' + res.data.partNumber)
        setExistMessage(true)
      }
      else {
        setExistString('MPN and MAKE does not exists. You may enter category and subcategory to proceed')
        setExistMessage(true)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const fetchSubcatDigits = async (categoryToFind) => {
    try {
      const res = await axios.get('/api/category/');
      var data = res.data;
      const w = data.find(cat => cat.category === categoryToFind)
      const num = data.find(cat => cat.category === categoryToFind && cat.subcategory === choosenSubcategory)
      console.log(num)
      subcatDigits = w.subcatDigits
      categoryNumber = num.categoryNumber
      subcategoryNumber = num.subcatNumber


    }
    catch (err) {
      console.log(err)
    }
  }


  const handleGenerate = async () => {

    try {
      await fetchSubcatDigits(choosenCategory)

      const res = await axios.get('/api/mpn/', {
        params: { choosenCategory, choosenSubcategory },
        cache: "no-store"
      });
      if (res.data == null) {
        // setExistMessage(true)
        // setExistString("Category and Subcategory does not exist")
        saveNewPN(0)
      }
      else {
        console.log(res.data)
        setData(res.data)
        generateNewPN(res.data.partNumber);
      }
    }
    catch (err) {
      console.log(err)
    }

  }



  const generateNewPN = (number) => {
    var partStr = String(number)


    var lastDigits = number.toString().slice(-3)

    if (lastDigits === '999') {
      setExistString('Cannot generate new part number as maximum limit has reached')
      setExistMessage(true)
    }
    else {
      var incrementedDigits = parseInt(lastDigits, 10) + 1;
      incrementedDigits = ("000" + incrementedDigits).slice(-3);

      var newPartNumber = parseInt(partStr.slice(0, -3) + incrementedDigits);

      // else if (subcatDigits === 3) {
      //   var lastDigits = number.toString().slice(-2)

      //   var incrementedDigits = parseInt(lastDigits, 10) + 1;
      //   incrementedDigits = ("00" + incrementedDigits).slice(-2);

      //   var newPartNumber = parseInt(partStr.slice(0, -2) + incrementedDigits);

      // }

      console.log(newPartNumber)

      saveNewPN(newPartNumber);
    }
  }

  const saveNewPN = async (number) => {
    console.log(mpn, make)
    // setData((prevData) => ({
    //   ...prevData,
    //   mpn: mpn,
    //   make: make,
    //   partNumber: number,
    // }));

    var newPartNumber;
    await fetchSubcatDigits();

    console.log(subcatDigits, categoryNumber, subcategoryNumber)

    if (number === 0) {


      newPartNumber = `10${categoryNumber}0${subcategoryNumber}001`


    }

    else {
      newPartNumber = number
    }

    console.log(newPartNumber)

    // if (number == 0) {
    //   newPartNumber = `1${category}${subcategory}001`
    //   newPartNumber = parseInt(newPartNumber)
    // }
    // else {
    //   newPartNumber = number
    // }

    const updated = {
      mpn: mpn,
      make: make,
      category: choosenCategory,
      subcategory: choosenSubcategory,
      partNumber: newPartNumber
    }

    const res = await axios.post('/api/mpn/', updated);
    if (res.status === 200) {
      setExistMessage(true)
      setExistString("New part number generated: " + newPartNumber)
    }

  }

  const openCategoryWindow = () => {
    setCatWindowVisible(true)
  }

  useEffect(() => {
    const fetchSubcat = async () => {
      const res = await axios.get('/api/category/')
      const allData = res.data;
      const uniqueSubCategories = [...new Set(allData.map(item => item.subcategory))];
      const filteredSubCategories = Array.from(new Set(
        allData
          .filter(item => item.category === choosenCategory)
          .map(item => item.subcategory)
      ));
      console.log(filteredSubCategories)
      setSubcategories(filteredSubCategories);

    }
    fetchSubcat();
  }, [choosenCategory])

  useEffect(() => {
    const fetchMake = async () => {
      const res = await axios.get('/api/addMake')
      const allmakes = res.data
      const names = allmakes.map((item) => item.name).filter(name => name);
      setMakes(names)
    }

    fetchMake();
  }, [])

  if (!loggedIn) {
    return <Login setLoggedIn={setLoggedIn} />
  }

  else {



    return (
      <div className="flex items-center justify-center  h-[100vh]">
        <div className={`flex ${catWindowVisible ? ' opacity-50 blur' : ''}  items-center text-black justify-center w-full h-full flex-col bg-[#F1F1F1]`}>
          <div className="flex flex-col items-center">
            <Image src="/accelor-nobg.png" alt="logo" width={200} height={200} />
            <h2 className="text-[5rem]  mb-4  stroked-text">PNGEN - V.01</h2>
          </div>
          <form className="flex flex-col gap-4 items-center justify-center " onSubmit={handleSearch}>
            <div className="flex flex-col gap-3">

              <input className="border border-gray-400 outline-none py-4 px-3 rounded-md w-[300px]" onChange={(e) => setMpn(e.target.value)} value={mpn} placeholder="Enter MPN" type="text" id="mpn" name="mpn" />

              {/* <input className="border outline-none p-2 rounded-md w-[300px]" onChange={(e) => setMake(e.target.value)} value={make} placeholder="Enter Make" type="text" id="make" name="make" /> */}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={make}
                onChange={(e, val) => setMake(val)}

                options={makes}
                sx={{ bgcolor: 'white' }}
                renderInput={(params) => <TextField  {...params} label="Choose Make" />}
              />
            </div>

            <div className="flex flex-col  gap-4 justify-center items-center">

              <button className="bg-green-500 px-5 w-[fit-content] rounded-md py-1 text-white hover:bg-green-700" type="submit" >Search</button>
              {/* <h3 id="part-number" className=""></h3> */}
            </div>
          </form>

          <div className="flex flex-col mt-10">


            <div className="flex gap-2 items-center justify-center">
              <div className="flex flex-col">
                <CategoryDropdown label="Choose category" onValueChange={setChoosenCategory} setCatWindowVisible={setCatWindowVisible} catWindowVisible={catWindowVisible} />

              </div>
              <div className="flex flex-col">


                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={choosenSubcategory}
                  onChange={(e, val) => setChoosenSubcategory(val)}

                  options={subcategories}
                  sx={{ width: 200, bgcolor: 'white' }}
                  renderInput={(params) => <TextField  {...params} label="Sub Category" />}
                />

              </div>
              {/* <p className="text-[0.8rem] text-gray-500">Category or subcategory not listed?</p> */}
              {/* <button onClick={openCategoryWindow} className=" bg-purple-900 px-3 py-2 text-white rounded-md">Add new category</button> */}
            </div>
            <button onClick={handleGenerate} id="generate-btn" type="button" className="bg-green-500 hover:bg-green-700 px-3 py-1 rounded-md text-white mt-5">Generate Part number</button>

            <h1 className="mt-2" id="generated-number"></h1>



          </div>


          <AnimatePresence>

            {existMessage &&
              <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className="absolute top-5 py-[10px] px-[15px] bg-slate-500 text-white flex  items-center justify-center gap-3  rounded-md shadow-sm shadow-black ">
                <h1 className="">{existString}</h1>
                <button onClick={() => setExistMessage(false)} className="">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clipRule="evenodd" />
                  </svg>
                </button>
              </motion.div>
            }
          </AnimatePresence>



        </div>
        <AnimatePresence>

          {catWindowVisible && <CreateCategory setCatWindowVisible={setCatWindowVisible} />}
        </AnimatePresence>

      </div>

    )
  }
}
