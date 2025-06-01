import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative z-50">
            <div className="w-screen sm:max-h-[92.5px] bg-gray-200 flex justify-between items-center px-4 py-3 sm:px-10">
                
                {/* Logo */}
                <div>
                    <img src="vssmall.jpg" className="max-w-90 hidden sm:block" alt="logo" />
                    <img src="icon.png" className="max-h-20 block sm:hidden rounded-2xl" alt="icon" />
                </div>

                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center">
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

                {/* Hamburger Icon */}
                <button
                    className="sm:hidden text-3xl mr-4 hover:cursor-pointer focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Accordion with Smooth Slide */}
            <div
                className={`sm:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                    isMenuOpen ? 'max-h-40 py-2' : 'max-h-0 py-0'
                } bg-gray-100 border-t border-gray-300 px-4`}
            >
                <ul className="flex flex-col gap-2">
                    <li>
                        <Link to="/result" onClick={() => setIsMenuOpen(false)}>
                            <div className="bg-blue-200 hover:bg-blue-300 transition duration-300 p-2 rounded-md text-center">
                                Home
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                            <div className="bg-blue-200 hover:bg-blue-300 transition duration-300 p-2 rounded-md text-center">
                                Exam
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Header;
