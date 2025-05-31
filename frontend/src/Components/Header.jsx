import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {

    return(
        <header className="relative z-50">
            <div id="header-container" className="w-screen sm:max-h-[92.5px] bg-gray-200 flex justify-between">
                <div id="header-logo">
                    
                    <img src="vssmall.jpg" className="max-w-90 hidden sm:block" /> :
                    <img src="icon.png" className="max-h-20 mx-5 mb-5 block sm:hidden rounded-2xl" />

                </div>

                <div id="options" className="mx-10 sm:my-5 flex items-center">
                    <ul className="list-none flex gap-6 select-none">
                        <li>
                            <Link to="/result">
                            <div className="bg-blue-200 hover:bg-blue-300 transition duration-500 hover:cursor-pointer p-2 px-8">Home</div>
                            </Link>
                            </li>
                        <li>
                            <Link to="/about">
                            <div className="bg-blue-200 hover:bg-blue-300 transition duration-500 hover:cursor-pointer p-2 px-8">Exam</div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header;