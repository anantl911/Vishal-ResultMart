import { useState, useEffect } from "react";

const DEPLOYED_BACKEND = import.meta.env.VITE_BACKEND_INSTANCE;

const ResultSearch = (props) => {

    const [candidateSeatNo, setCandidateSeatNo] = useState("");
    const [POB, setPOB] = useState("");


    const handleSubmit = async () => {
        if((POB === "" || candidateSeatNo === "") || (POB === " " || candidateSeatNo === " ")){
            alert("You didn't enter shit.")
            props.setLoaded(true);
            return;
        } 
        
        try{
            const response = fetch(`${DEPLOYED_BACKEND}/api/getresult/${encodeURIComponent(candidateSeatNo)}&${encodeURIComponent(POB)}`).then(response => response.json()).then(result => {
                if(result.success) {
                    props.storeResult(result.data);
                    props.updateShowResult();
                    props.setLoaded(true);
                } else{
                    let msg = result.msg;
                    alert(msg);
                    props.setLoaded(true)
                }
            });
        } catch(error) {
            alert("Some error occurred: ", error);
             props.setLoaded(true);
        }
    };

    const handleDeletion = () => {
    const seatNo = prompt("Seat No: ");
        fetch(`${DEPLOYED_BACKEND}/api/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ seatNo })
        }).then(response => response.json()).
        then(result => {
            console.log(result);
            if(result.success) alert(result.msg)
            else alert(result.msg)
        }).catch (err => {
            console.log("Deletion aborted by user or some error occured.", err)
        })
        
    };

    const handleChangeSeatNo = (e) => setCandidateSeatNo(e.target.value); 

    const handleChangePOB = (e) => setPOB(e.target.value); 


    return(
            <div id="result-box" className="w-full min-h-150 flex items-center justify-center">
                <div id="container" className=" w-80 md:w-[40vw] min-h-80 bg-gray-200 select-none">
                    <div id="header" className="bg-[#ea258e] text-white">
                        <h2 className="text-center p-2">Group S Examination - Results 2025</h2>
                    </div>

                    <div id="result-form" className="min-h-70 flex justify-center items-center">
                        <div id="form-container">
                        <form onSubmit={(e, seatNo, placeOfBirth) => {
                            e.preventDefault();
                            props.setLoaded();
                            handleSubmit(seatNo, placeOfBirth);
                        }}>
                            <div id="input-container" className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-5 pt-8">
                                        <div id="seat-no-input" className="flex flex-col gap-2">
                                            <label htmlFor="seatNo" className="flex items-center justify-center">Enter seat no</label>
                                            <input type="text" id="seatNo" value={candidateSeatNo} onChange={handleChangeSeatNo} placeholder="Seat No" className="h-8 lg:px-[3vw] text-center transition duration-200 bg-gray-100 outline-none"/>
                                        </div>

                                        <div id="pob-input" className="flex flex-col gap-2">
                                            <label htmlFor="placeofBirth" className="flex items-center justify-center">Enter POB</label>
                                            <input type="text" id="placeOfBirth" value={POB} onChange={handleChangePOB} placeholder="Place of Birth" className="h-8 lg:px-[3vw] text-center bg-gray-100 outline-none"/>
                                        </div>
                                        </div>

                                        <div className="w-full flex justify-center">
                                            <input type="submit" value="Check" className="bg-[#0375b3] transition duration-500 hover:cursor-pointer hover:bg-blue-400 py-1 px-6 text-white"/>
                                        </div>

                                        <div className="text-center relative bottom-2" onClick={handleDeletion}>
                                            <p className="text-[#0375b3] hover:text-[#0375b3c4] hover:cursor-pointer">Have your name removed.</p>
                                        </div>

                                    </div>



                        </form>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default ResultSearch;