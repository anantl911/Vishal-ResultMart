import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuHeight, setMenuHeight] = useState(0);
    const menuRef = useRef(null);

    useEffect(() => {
        if (isMenuOpen && menuRef.current) {
            setMenuHeight(menuRef.current.scrollHeight);
        } else {
            setMenuHeight(0);
        }
    }, [isMenuOpen]);

    return (
        <header className="relative z-50">
            <div id="header-container" className="w-screen sm:max-h-[92.5px] bg-gray-200 flex justify-between">
                <div id="header-logo">
                    <img src="vssmall.jpg" className="max-w-90 hidden sm:block" />
                    <img src="icon.png" className="max-h-20 mb-5 mx-10 mt-5 block sm:hidden rounded-2xl" />
                </div>

                <div id="options" className="mx-10 sm:my-5 hidden sm:flex items-center">
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

                <button
                    className="sm:hidden text-4xl mr-8 hover:cursor-pointer focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>

            <div
                className="sm:hidden overflow-hidden transition-all duration-500 ease-in-out bg-gray-100 border-t border-gray-300 px-4"
                style={{ maxHeight: `${menuHeight}px` }}
            >
                <ul ref={menuRef} className="flex flex-col gap-2 py-2">
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
