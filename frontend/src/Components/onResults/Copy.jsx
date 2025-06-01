import {useState, useEffect} from "react";

const Copy = (props) => {

    const [buttonText, setBtnText] = useState("Copy");
    const [timerText, setTimerText] = useState("");
    const [timerFinished, setTimerFinished] = useState(false);
    const [timerCount, setTimerCount] = useState(3);

    const getInstaCopy = () => {
        return "Vishal MegaMart ka exam diya tha 🔥🔥"
    }

    const getLinkedIn = () => {
        return `🎯 Just attempted the Vishal Mega Mart recruitment exam — and it’s left me with a lot to reflect on.

The journey so far hasn’t been easy. There were doubts, late nights, and moments where I seriously questioned myself. But sometimes, it's in those exact moments that we learn the most — not just about the exam, but about who we are and what we still need to become.

I’ve realized there's a lot of ground to cover — skills to sharpen, discipline to build, and confidence to grow. This isn’t the end of the road — it's just the start of a better version of me. 🚀

To my family and friends — thank you. Your encouragement, even when I wasn’t sure of myself, has meant everything. You kept me grounded, motivated, and moving forward.

I know next year I'll make it. I’m committed to showing up, learning, and becoming better with every step.

Here’s to growth, resilience, and keeping the fire alive 🔥

You can give the exam too at vsmge2025.vercel.app

#JobSearch #VishalMegaMart #GrowthMindset #Gratitude #KeepPushing #CareerJourney`;
    }

    const getWhatsApp = () => "Just gave Vishal MegaMart exam. Check out my result"

    const getFacebook = () => "Hey guys check out my Vishal MegaMart result"


    const getCopyMsg = () => 
        {

        switch(props.mediaName){
            case "Instagram":
                return getInstaCopy();
            case "WhatsApp":
                return getWhatsApp();
            case "LinkedIn":
                return getLinkedIn();
            case "Facebook":
                return getFacebook();
            default:
                return "You found an error";
        }
    }

    useEffect(() => {
        if(timerFinished) return;
        
        if(timerCount === -2) {
            setTimerFinished(true);
            
            
            switch(props.mediaName){
                case "Instagram":
                    instagramShare();
                    break;
                case "Facebook":
                    facebookShare();
                    break;
                case "WhatsApp":
                    whatsAppShare();
                    break;
                case "LinkedIn":
                    linkedInShare();
                    break;
            }
            const shareResponse = fetch(`${import.meta.env.VITE_BACKEND_INSTANCE}/api/sharespike`, {method: "POST"}).catch(() => {});
            props.flipCopyTriggered(false);
        } else{

        const timer = setTimeout(() => {
            setTimerText(`Redirecting to ${props.mediaName} in ${timerCount}...`)
            setTimerCount(prev => prev - 1);
        }, 1000);
        
       
        return () => clearTimeout(timer);
        }
    }, [timerCount])

    useEffect(() => {

        const textField = document.getElementById("social-text");
        textField.select();
        document.execCommand("copy");
        setBtnText("Copied!")
        setTimerCount(3)
    }, []);

    const whatsAppShare = (message="notgonnawork") => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(getWhatsApp())}`;
        window.open(url, "_blank");
    };

    const facebookShare = (message="notgonnawork") => {
        const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const instagramShare = () => {
        const url = "https://www.instagram.com";
        window.open(url, "_blank");
    }

    const linkedInShare = (message="notgonnawork") => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handleCopy = () =>{
        
    }

    return (
        <div id="black-overlay" className="fixed inset-0 w-full h-full flex justify-center items-center bg-[rgba(0,0,0,0.25)] backdrop-blur-xs z-50">
            <div id="copy-container" className="absolute ">
                <div id="header" className="bg-[#ea258e] py-2 px-6 text-center">
                    <h1 className="text-white">{props.mediaName} post</h1>
                </div>
                <div id="data" className="flex flex-col items-center justify-center gap-6 bg-gray-200 w-80 p-10">
                    <div className="max-w-20 overflow-hidden">
                    <img src={props.imgURL} className="scale-[180%]"/>
                    </div>
                    <textarea id="social-text" readOnly value={timerText === "" ? getCopyMsg() : timerText} className="h-30 outline-none w-60 resize-none p-2 bg-gray-300" />
                    <button disabled
                    className="bg-[#0274b2] hover:cursor-pointer transition duration-500 p-2 text-xs px-6 text-white"
                    onClick={() => {
                        handleCopy()
                        }}>{buttonText}</button>
                </div>
            </div>
        </div>
    )
}

export default Copy;