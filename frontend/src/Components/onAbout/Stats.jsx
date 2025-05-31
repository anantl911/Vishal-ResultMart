import CountStats from "./CountStats.jsx";
import Histogram from "./Histogram";
import {useState, useRef} from "react";
import { addNewCandidate, changeDefaultInst } from "../../helpers/candidateHandler.js";


const Stats = (props) => {

    const [fName, setFName] = useState("");
    const [mName, setMName] = useState("");
    const [lName, setLName] = useState("");
    const [instInitials, setInstInitials] = useState("");
    const [broadcastMsg, setBroadcastMsg] = useState({"msgTopic":"Toughest Subject", "msg": "KKW Survival"});

    const generateHistogramData = () => {
        return Object.entries(props.histogramData).map(data => (
            {range: data[0], count: data[1]}
        ))
    }

    // const scatterData = [
    // { x: 10, y: 30 },
    // { x: 20, y: 100 },
    // { x: 30, y: 75 },
    // { x: 40, y: 50 },
    // { x: 50, y: 120 },
    // ];

    




    const getTopper = () => {
    let topperCount = 0;
    return props.toppersList.map(topper => {
        topperCount += 1;

        return (
            <div
                id={`topper-${topperCount}`}
                className="text-[clamp(13px,1vw,16px)]"
                key={`topper-${topperCount}`}
            >
                <div
                    id="topper-info"
                    className={`flex items-center justify-between text-vw border border-[rgba(0,0,0,0.1)] hover:opacity-80 transition duration-500 ${
                        topperCount % 2 === 0 ? "bg-gray-100" : "bg-gray-20"
                    }`}
                >
                    <p id="rank" className="w-[10%] pl-3">{topperCount}</p>
                    <p id="name" className="w-[35%] truncate">
                        {topper.name.split(" ")[1] + " " + topper.name.split(" ")[0]}
                    </p>
                    <p id="seatNo" className="w-[30%]">{topper.seatNo}</p>
                    <p id="percentile" className="w-[20%] text-right pr-2">{topper.percentile}</p>
                </div>
            </div>
        );
    });
};



    const populateInputField = (inputVal,setter,labelText, id, placeholderText = "...") => {
        return <div className="flex flex-col items-center">
            <label htmlFor={id}>{labelText}</label>
            <input type="text" onChange={(e) => {handleChange(e,setter)}} value={inputVal} id={id} className="w-[60%] h-5 text-center bg-gray-200" placeholder={placeholderText}/>
        </div>
    }

    const handleChange = (e,setter) => {
        const val = e.target.value;
        setter(val);
    }

    const changeBroadcastValue = (msgTopic, msg) => setBroadcastMsg({"msgTopic":msgTopic ,"msg": msg});

    const handleFormSubmit = async () => {
        const result = await addNewCandidate(fName, mName, lName, instInitials, props.resultList, changeBroadcastValue)
    }

    return(
        <section id="stats" className="min-w-full md:min-w-[70%] flex flex-col pb-10  min-h-[93rem] md:min-h-[40rem] bg-gray-200">

                <div id="container-1" className="flex flex-col lg:flex-row min-w-[100%]">
                    <div></div>
                    <div id="histogram" className="w-full p-10 md:p-0 mt-10 sm:mt-0 md:mt-10 lg:mt-0 pt-10 lg:p-10 lg:pr-0">
                        <Histogram data={generateHistogramData()}/>
                    </div>

                    <div id="topper-list" className="w-full h-full md:h-85 pt-5 lg:pt-0 flex relative lg:top-10 justify-center select-none">
                        <div className=" bg-gray-300 h-[85%] w-fit  md:h-full">
                            <div id="topper-header" className="relative top-2">
                                <h3 className="text-center text-[clamp(20px,1.2vw,100px)]">Toppers</h3>
                            </div>
                            <div className="p-4 py-5 flex flex-col ">
                                {getTopper()}
                            </div>
                        </div>
                    </div>

                </div>

                <div id="container-2" className=" px-10 flex flex-col mt-10 lg:mt-0 md:flex-row items-center gap-20 w-full">

                   <div id="sub-container-1" className="flex flex-col">
                        <CountStats totalPass={props.totalPass} checkCount={props.resultChecked} socialShareCount={props.socialShareCount} totalCount={props.totalCount} />

                        <div className="bg-gray-300 border border-[rgba(0,0,0,0.1)] mt-10 flex">
                            <div id="announcement" className="flex">
                                <h3 className="md:text-lg flex items-center justify-center bg-[#eb268f] w-fit text-s select-none md:px-6 p-2 text-white">{broadcastMsg.msgTopic}</h3>
                                <p className="text-s md:text-lg pl-4 p-2 text-[#000000]  ">{broadcastMsg.msg}</p>
                            </div>
                        </div>
                   </div>

                    <div id="reattempt" className="w-full md:max-w-82 md:w-full min-h-[95%] md:min-h-[85%] bg-gray-300 ">
                        <div id="tough-subject header" className="text-white bg-[#0274b3] p-2">
                            <h3 className="text-center">Try the exam</h3>
                        </div>

                        <div id="input">
                            <form className="flex flex-col gap-8 py-5" onSubmit={(e) => {
                                e.preventDefault();
                                handleFormSubmit();
                            }}>

                            <div id="input-fields" className="flex flex-col gap-4">
                                {populateInputField(fName,setFName,"First Name", "fName")}

                                {populateInputField(mName,setMName,"Middle Name", "mName")}

                                {populateInputField(lName,setLName,"Last Name", "lName")}

                                {populateInputField(instInitials,setInstInitials,"Institute Name", "Inst initials", "instInitials")}
                            </div>


                            <div id="submit-btn" className="flex justify-center">
                                <div className="w-full flex justify-center">
                                    <input type="submit" value="Try" className="bg-[#0375b3] transition duration-500 hover:cursor-pointer hover:bg-blue-400 py-1 px-6 text-white"/>
                                </div>
                            </div>
                            </form>
                        </div>
                    </div>
                </div>

                

        </section>
    )
}

export default Stats;