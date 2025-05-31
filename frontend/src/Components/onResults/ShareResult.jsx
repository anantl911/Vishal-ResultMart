const ShareResult = (props) => {


    return(
            <div id="share-struggle-box" className="select-none mt-2">
            <div id="socials-container" className="bg-[#E0E0E0] border-1 border-[rgba(0,0,0,0.1)] flex flex-col items-center gap-2 ">
                <div id="header" className="bg-[#0274b2] text-[rgb(255,255,255)] p-4">
                    <h3 className="text-[clamp(14px,2.4vw,16px)] font-semibold">Share your struggle!</h3>
                </div>

                <div id="social-media-icons" className="flex gap-2 relative bottom-1 p-2 items-center justify-center">
                    <div id="Instagram" onClick={(e) => {
                        props.sharePost(e);
                        }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Instagram_logo_2022.svg" 
                        className="max-h-5 max-w-5 hover:cursor-pointer scale-[110%]"/>
                    </div>

                    <div id="Facebook" onClick={(e) => {
                        props.sharePost(e);
                        }}>
                        <img src="social-media/facebook.png"
                        className="max-h-5 max-w-5 hover:cursor-pointer scale-[180%]" />
                    </div>

                    <div id="LinkedIn" onClick={(e) => {
                        props.sharePost(e);
                        }}>
                        <img src="social-media/linkedin.png"
                        className="max-h-5 max-w-5 rounded-sm hover:cursor-pointer scale-[115%]" />
                    </div>

                    <div id="WhatsApp" onClick={(e) => {
                        props.sharePost(e);
                        }}>
                        <img src="social-media/whatsapp.png"
                        className="max-h-5 max-w-5 rounded-sm hover:cursor-pointer scale-[115%]" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShareResult;