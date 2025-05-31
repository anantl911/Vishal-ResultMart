import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import {  addNewCandidate, changeDefaultInst } from "../../helpers/candidateHandler.js";
import { createDocx } from '../../helpers/createDocs.js';
import { handleFileUpload } from '../../helpers/NameExtractor.js';
import BarSpinner from '../../spinners/BarSpinner.jsx';
import RoundLoader from '../../spinners/RoundSpinner.jsx';
import MagnifyingSpinner from '../../spinners/MagnifyingSpinner.jsx';
import ExplodeSpinner from '../../spinners/ExplodeSpinner.jsx';
import Checkmark from '../../spinners/LottieCheck.jsx';

const DEPLOYED_BACKEND = import.meta.VITE_BACKEND_INSTANCE;


export default function MassGenerate() {
  const [file, setFile] = useState({files: null, uploaded: false});
  const [loading, setLoading] = useState({parentLoading: false, uploadLoading: false, nameSearchLoading: false, giftLoading: false, loaded:false});
  const [nameGenPromo, setNameGenPromo] = useState("How this works?")
  const [instituteInitials, setInstInitials] = useState("");
  const [loadedLoadSuccess, setLoadSuccess] = useState("false");
  const [fetchedList, setFetchedList] = useState(null);
  const [generationCounter, setGenerationCounter] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

useEffect(() => {
  const getRecords = async () => {
    const response = await fetch(`${DEPLOYED_BACKEND}/api/fetchall`)
      .then(response => response.json())
      .then(data => { return data });

      console.log("Response to this shit: ", response);
    if(response.success) setFetchedList(response.data);
  }
  
  getRecords();
}, [generationCounter])


useEffect(() => {
  const handleResize = () => setWindowWidth(window.innerWidth);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize",handleResize);
}, [])


const handleGenerate = async () => {
  let promoFailText = "No names found in file!";
  let successList = [];
  if (!file.uploaded) return;
  if (!fetchedList) return;
  let duplicateCount = 0;
  if(instituteInitials === "" || instituteInitials === " "){
    setNameGenPromo("Enter institute name!");
  }
  if(instituteInitials.length > 8 || instituteInitials.split(" ").length > 1) setNameGenPromo("Institute initials not name."); 
 
  try {
    let result = await handleFileUpload(file.files);

    if(result.success){
    
    const resultList = result.names;

    const resultFlawed = resultList.some(userResult => {
      return userResult.first.split(" ").length > 1 || userResult.middle.split(" ").length > 1 || userResult.first.split(" ").length > 1
    })

    if(resultFlawed){
      if(resultList[0].middle.split(" ").length === 2 ){
        result.names = resultList.map(userResult => {
          return {first: userResult.middle.split(" ")[0], middle: userResult.middle.split(" ")[1] || userResult.middle, last: userResult.first }
        })
      }
    } 
    
    console.log("resultList: ",resultList,"\nresultFlawed: ",resultFlawed);

    for (const user of result.names) {
      const result = await addNewCandidate(
        user.first, user.middle, user.last,
        instituteInitials, fetchedList
      );

      

      if(result.success) {
        let fullName = user.first + " " + user.middle + " " + user.last;
        successList.push({seatNo: result.SeatNo, name: fullName});
      } else{
        if(result.msg === "Duplicate name") duplicateCount += 1;
      }
    }

    if(successList.length > 0 ) console.log("Pushed records");
    else{
      console.log("Duplicate Count: ", duplicateCount, "Actual name length: ",result.names.length)
      if(duplicateCount >= (result.names.length - 20) && duplicateCount <=  (result.names.length)) promoFailText = "Duplicate records rejected!";
      else promoFailText = "Bad file. No records found!";

      result.names = [];
    }
    }


    setLoading({ parentLoading: true, uploadLoading: true, nameSearchLoading: false, giftLoading: false, loaded: false });
    setNameGenPromo("Receiving your file.")

      if(result.names.length === 0) {
        await new Promise((res) => setTimeout(res, 200));
        setLoadSuccess
        setLoadSuccess(false);
        setLoading(prev => ({...prev,loaded:true, uploadLoading: false, parentLoading: false}))
        setNameGenPromo(promoFailText);

        return;
      } else setLoadSuccess(true)

    await new Promise((res) => setTimeout(res, 1500));
    setLoading((prev) => {
      setNameGenPromo("Searching for names...")
      return { ...prev, uploadLoading: false, nameSearchLoading: true }});

    if(duplicateCount > 0) {
    await new Promise((res) => setTimeout(res, 200));
    setLoading((prev) => {
      setNameGenPromo("Removing duplicate entries!")
      return { ...prev, uploadLoading: false, nameSearchLoading: true }}); }

    await new Promise(async (res) => setTimeout(res, 1300));
    setNameGenPromo("Send Seat Nos to your friends")
    createDocx(successList, "vssmall.jpg")

    await fetch(`${DEPLOYED_BACKEND}/api/pushCountIncr`, {method: "POST"}).then(response => response.json()).then((data) => data);

    setLoading((prev) => ({ ...prev, nameSearchLoading: false, giftLoading: true }));

    await new Promise((res) => setTimeout(res, 1000));

    

    setLoading({ parentLoading: false, uploadLoading: false, nameSearchLoading: false, giftLoading: false, loaded: true });

    if (result.success) {
      setGenerationCounter(prev => prev + 1 );
    } else {
      console.error(result.error);
    }

  } catch (err) {
    console.error("Error during generation:", err);
    setLoading({ parentLoading: false, uploadLoading: false, nameSearchLoading: false, giftLoading: false, loaded: false });
  }
};

  const handleFile = (event) => {
      const uploadedFiles = Array.from(event.target.files);
      setFile({files: uploadedFiles, uploaded:true});
  }

  const handleInstInitialsChange = (e) => setInstInitials(e.target.value);

  // =========================================================================================

  return (
    <div className="p-6 bg-gray-200 w-full mt-12  space-y-4 transition duration-500">
      <div className="p-2 w-full flex flex-col gap-5 relative">
        
        <div id="header" className="w-fulll">
              <h3 className="text-2xl">Surprise your friends!</h3>
          </div>

        <div id="content-container" className="p-6 gap-10 flex flex-col items-center md:items-start md:justify-center md:flex-row w-full">

          

          <div id="input-side" className="flex flex-col justify-around gap-14 flex-1 md:flex-[0.6]">
            
            <div id="input-fields" className="w-full" >
                <div id="input-container" className="pl-2 w-full">
                  <form>
                    <div className="flex flex-col gap-4 items-center">
                      <label htmlFor="instInitials" className=" text-[clamp(18px,1.2vw,18px)]">Enter your institute name</label>
                      <input type="text" onChange={(e) => {handleInstInitialsChange(e)}} value={instituteInitials} id="instInitials" className="w-full p-1 px-4 text-center outline-none bg-gray-300" placeholder="Institute initials"/>

                      <div className="flex flex-col items-center space-x-4 mt-4 w-full">
                          <div className="flex flex-col items-center w-full">
                            <label
                              htmlFor="file-upload"
                              className={`border-4 border-gray-300 border-dotted text-xs py-2 px-6 transition duration-200
    ${loading.parentLoading ? "bg-gray-300 cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                            >
                              Upload File
                            </label>
                            <input
                              id="file-upload"
                              type="file"
                              accept=".docx,.doc,.xlsx,.xls,.pdf"
                              name="Hello"
                              disabled={loading.parentLoading}
                              onChange={handleFile}
                              className="hidden"
                            />
                          </div>
                          <div className="flex  relative top-9 right-2 border-2 border-gray-300">
                            <div className="w-6 h-6 bg-[#5128282a] flex justify-center items-center">
                            <img src="icons/file.svg" className="max-w-6 max-h-6 " />
                            </div>
                            <p className="text-xs flex items-center justify-center select-none px-2 ">{file.uploaded ? `${file.files[0].name}` : "No file uploaded"}</p>
                          </div>
                    </div>
                  </div>
                
                </form>
                </div>
            </div>

            <div id="get-seats-btn">
              <button id="seats" disabled={loading.parentLoading}   className={`text-white w-full p-2 transition duration-500 
    ${loading.parentLoading ? "bg-gray-400 cursor-not-allowed" : "bg-[#0274b3] hover:cursor-pointer hover:bg-blue-900"}`}
              onClick={() => {
                handleGenerate();
              }}>Generate Results</button>
            </div>
            </div>

            <div id="activity-section" className="border-2 flex flex-col flex-1 border-gray-300 bg-gray-300 p-3 border-dotted">
              <div id="how-header" className="py-4">
                <h3 className="relative text-xl text-center">{nameGenPromo}</h3>
              </div>

              <div id="process" className="flex gap-2 md:gap-10 p-4 text-xs">
                  <div className="flex flex-col flex-1 gap-3 max-h-16 max-w-16 items-center">
                    
                   <div className="flex justify-center items-center bg-[#efc849] h-16 w-16 rounded-full">
                      { !loading.uploadLoading && <img src="icons/upload.png"/> }
                      { loading.uploadLoading && <div className="flex scale-[50%] h-16 w-16  justify-center items-center">
                        <RoundLoader />
                      </div>}
                    </div> 
                    <p className="text-center">You will upload documents {windowWidth > 770 ? "(sheets, docs, etc)" : ""}.</p>
                  </div>

                  <p className="relative top-10">&gt;&gt;</p>

                  <div className="flex flex-col flex-1 gap-3 items-center">
                    <div className="relative h-16 w-16 flex justify-center items-center">
                      {!loading.nameSearchLoading && (
                        <img src="icons/magnifyingGlass.png" alt="Search icon" className="h-16 w-16" />
                      )}
                      
                      {loading.nameSearchLoading && (
                        <div
                          className="h-16 w-16 bg-no-repeat bg-center bg-contain"
                          style={{ backgroundImage: "url('icons/magnifyingFiles.png')" }}
                        >
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-50">
                            <MagnifyingSpinner />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-center">We then extract names and generate results for your friends.</p>
                  </div>

                  <p className="relative top-10">&gt;&gt;</p>

                  <div className="flex flex-col flex-1 gap-3 items-center">
                          <div
                            className="h-16 w-16 bg-no-repeat bg-center bg-contain"
                            style={{ backgroundImage: "url('icons/surprise.png')" }}
                          >
                          {loading.giftLoading && (  <div className="h-16 w-16 scale-[40%] opacity-60 flex justify-center items-center">
                              <ExplodeSpinner />
                            </div>
                        )}
                        </div>
                    <p className="text-center">Your friends see if they made it into Vishal Mega Mart via their result.</p>
                  </div>
              </div>

            </div>
          </div>
              <div className={`scale-[40%] ${loading.parentLoading ? 'opacity-80' : 'opacity-0'} flex justify-center`}>
                <BarSpinner />
                
              </div>
              { loading.loaded && <div className="absolute w-full flex justify-center bottom-5">
              <div className={loadedLoadSuccess ? `max-h-2 max-w-2 scale-[4500%]` : `max-w-2 max-h-2 scale-[800%]`}>
              < Checkmark success={loadedLoadSuccess}/> 
              </div>
              </div>}
      </div>
      </div>
  );
}