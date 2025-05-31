import {BrowserRouter, Link} from "react-router-dom"


const Footer = () => {
    return(
        <footer className="bottom-0 w-full bg-black text-white select-none">

            <div id="top-footer-container" className="flex justify-between p-10 px-13">
                <div id="footer-info" className="flex flex-col gap-1">
                    <div id="header">
                        <h3 className="text-2xl">Vishal ResultMart</h3>
                    </div>
                    
                    <div id="additional-text">
                        <p className="w-[70%]">A passionate brainrot CRUD project after a sea of CRUD apps on the internet. Says a shitty crud app.</p>
                    </div>
                </div>
                

                <div id="links" className="text-lg">
                    <nav className="flex flex-col gap-2">
                        <Link to="/result">Home</Link>
                        <Link to="/about">Exam</Link>
                        <a href="#">Back to top</a>
                    </nav>
                </div>
            </div>
            
            <p className="text-center py-2 pt-4 border-t-1 border-t-[rgba(255,255,255,0.25)] ">Not affiliated/associated with Vishal MegaMart.</p>
        </footer>



    )
}

export default Footer;