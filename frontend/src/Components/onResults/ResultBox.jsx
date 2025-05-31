import ShareResult from "./ShareResult.jsx";
import { useState } from "react";
import html2canvas from "html2canvas";


import { ref, uploadString, deleteObject, getDownloadURL } from "firebase/storage";
import { storage } from "../../helpers/firebase.js"; 
import Copy from "./Copy.jsx";

const ResultBox = (props) => {

    const [uploadedImg, setUploadedImg] = useState({uploaded: false, url: "", img: null, captured: false, storageRef: null});
    const [copyTriggered, setCopyTriggered] = useState(false);
    const [clickedSocialMedia, setClickedSocialMedia] = useState("");

    const populateCandidateInfo = () => (
        <table className="w-full text-left border border-[#9ca3af]"> {/* border-gray-400 → #9ca3af */}
            <tbody>
                <tr className="border-b border-[#9ca3af]"> {/* border-gray-400 */}
                    <th className="p-2 w-1/2 border-r border-[#9ca3af] bg-[#f3f4f6]">Roll No.:</th> {/* bg-gray-100 → #f3f4f6 */}
                    <td className="p-2">{props.seatNo}</td>
                </tr>
                <tr className="border-b border-[#9ca3af]">
                    <th className="p-2 border-r border-[#9ca3af] bg-[#f3f4f6]">Candidate Name:</th>
                    <td className="p-2">{props.candidateName}</td>
                </tr>
                <tr>
                    <th className="p-2 border-r border-[#9ca3af] bg-[#f3f4f6]">Place of Birth</th>
                    <td className="p-2">EARTH</td>
                </tr>
            </tbody>
        </table>
    );

    const uploadImage = async () => {
        if(uploadedImg.captured){
            if(!uploadedImg.uploaded){
                try {
                    const imageRef = ref(storage, `tempUploads/${Date.now()}.png`);

                    const snapshot = await uploadString(imageRef, uploadedImg.img, "data_url");

                    const downloadURL = await getDownloadURL(snapshot.ref);

                    
                    setUploadedImg(prev => ({...prev, uploaded: true, url: downloadURL, captured:true, storageRef: imageRef}));
                } catch (error) {
                    console.error("Failed to upload or either delete", error);
                }
            }
        } else {
            const resultImg = await handleCapture();
            setUploadedImg(prev => ({...prev, img: resultImg, captured: true}));
        }
    };

    const downloadImage = (base64Image, filename = "vishalMega_result.png") => {
        const link = document.createElement('a');
        link.href = base64Image;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleCapture = async () => {
        const resultElement = document.getElementById("container"); 
        const canvas = await html2canvas(resultElement);
        const image = canvas.toDataURL("image/png");
        downloadImage(image);
        return image;
    };

    const sharePost = async (e) => {

        const clickedSocial = e.currentTarget.id;

        const capturedImage = await handleCapture();
        setUploadedImg(prev => ({...prev, uploaded: true, url: capturedImage, captured:true}));

        setClickedSocialMedia(clickedSocial);
        setCopyTriggered(true);

    }

    const flipCopyTriggered = (val = false) => setCopyTriggered(val);

    const populateSubjectInfo = () => {
        let subjectCode = 183;

        return (
            <table className="w-full text-center border border-[#9ca3af] mt-8"> {/* border-gray-400 */}
                <thead>
                    <tr className="bg-[#005e8b] text-white">
                        <th className="p-2 border-r border-[#9ca3af]">SUBJ.</th>
                        <th className="p-2 border-r border-[#9ca3af]">SUBJECT NAME</th>
                        <th className="p-2 border-r border-[#9ca3af]">TH</th>
                        <th className="p-2 border-r border-[#9ca3af] ">PR</th>
                        <th className="p-2 border-r border-[#9ca3af]">TOT</th>
                        <th className="p-2">GRADE</th>
                    </tr>
                </thead>
                <tbody className="border-b border-[#d1d5db]"> {/* border-b-1: Tailwind doesn’t have border-b-1, using border-b + light gray */}
                    {props.subjects.map((subject, index) => {
                        subjectCode += 1;
                        const total = subject.theory_marks + subject.practical_marks;
                        return (
                            <tr key={index} className="even:bg-[#f3f4f6] border-t border-[#9ca3af]"> {/* even:bg-gray-100, border-t (gray-400) */}
                                <td className="p-2 border-r border-[#9ca3af]">{subjectCode}</td>
                                <td className="p-2 border-r border-[#9ca3af]">{subject.subjectName.toUpperCase()}</td>
                                <td className="p-2 border-r border-[#9ca3af]">{subject.theory_marks}</td>
                                <td className="p-2 border-r border-[#9ca3af]">{subject.practical_marks}</td>
                                <td className="p-2 border-r border-[#9ca3af] font-semibold">{total}</td>
                                <td className="p-2">{subject.grade}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td className="select-none border border-[rgba(0,0,0,0.3)] text-[#d1d5dc]">H</td> {/* text-gray-200, border-black */}
                        <td colSpan="4" className="text-center py-4 border border-[rgba(0,0,0,0.3)]">
                            <div className={`inline-block px-4 py-2 rounded-sm font-bold border border-[rgba(0,0,0,0.3)] bg-[#f6f6f6] ${
                                props.finalResult.toLowerCase() === "fail"
                                    ? "text-[#af0705]"
                                    : "text-[#2f855a]"
                            }`}>
                                {props.finalResult === "Fail" ? "REJECTED" : "ACCEPTED"}
                            </div>
                        </td>
                        <td className="select-none border border-[rgba(0,0,0,0.3)] text-[#d1d5dc]">H</td>
                    </tr>
                </tfoot>
            </table>
        );
    };

    const handleCloseClick = () => {
        if(uploadedImg.storageRef) deleteObject(uploadedImg.storageRef)
        props.updateShowResult();
    }

    return (
        <>
        

        <div id="result-box" className="w-full min-h-200 pb-10 mt-20 mb-20 flex items-center justify-center">
            {copyTriggered && <Copy mediaName={clickedSocialMedia} imgURL={uploadedImg.url}
            flipCopyTriggered={flipCopyTriggered}/>}
              <div id="container" className="w-100 md:w-[40vw] ml-5 mt-25 mb-25 lg:mt-0 lg:mb-0 min-h-120 bg-[#e5e7eb] shadow-md select-none"> {/* bg-gray-200 → #e5e7eb */}

                <div id="header" className="bg-[#ea258e] text-[rgb(255,255,255)] ">
                    <h2 className="text-center p-2 font-semibold">Group S Examination - Results 2025</h2>
                </div>

                <div id="result-data" className="flex flex-col items-center gap-2 mt-8 p-8 pt-2">
                    <div id="candidate-info" className="w-full">
                        {populateCandidateInfo()}
                    </div>
                    <div id="subject-info" className="w-full">
                        {populateSubjectInfo()}
                    </div>
                    <p className="text-[clamp(13px,1vw,100px)]">Total marks: {props.totalMarks} | Percentage: {((props.totalMarks / 500) * 100).toFixed(2)}%</p>

                    <div id="share">
                        <ShareResult sharePost={sharePost}/>
                    </div>
                </div>

                <div id="btn-container" className="w-full flex justify-center">
                    <button
                        id="close-btn"
                        className="bg-[#0375b3] hover:cursor-pointer hover:bg-[#2196F3] transition duration-200 text-[rgb(255,255,255)] py-1 px-6 mb-4"
                        onClick={handleCloseClick}
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
        </>
    );
};

export default ResultBox;
