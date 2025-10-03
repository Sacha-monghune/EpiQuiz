"use client"
import Link from "next/link";

import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className="w-full h-24 bg-[#2F53DE]">
            <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16 font-[Open Sans]">
                <Link href="/">
                    <h1 className="font-Montsserat text-2xl font-bold">EPIQUIZ</h1>
                </Link>
                <ul className="hidden sm:flex space-x-8 font-semibold">
                    <li className=" group text-xl">
                        <Link href="/">
                            Home
                        </Link>
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                    </li>
                    <li className="group text-xl">
<<<<<<< HEAD
                        <Link href="/">
=======
                        {/* mettre une redirection vers la page de quiz  */}
                        <Link href="/quiz">
>>>>>>> f17e044ee08089624850f8d1be2c606cda58121d
                            Quiz
                        </Link>
                        <div className="bg-white h-[2px] w-0 group-hover:w-full transition-all duration-500"></div>
                    </li>
                </ul>


                <div className="hidden sm:flex space-x-4">
                    <Link href="/auth">
                    <button className="bg-[#8F9BFA] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#C1CCF5] transition cursor-pointer">Sign In</button>
                    </Link>
                </div>

                <div className="sm:hidden">
                    <button onClick={() => setOpen(!open)}>
                        {open ? <X size={28}/> : <Menu size={28}/>}
                    </button>
                </div>

            </div>
            {open && (
                <div className="sm:hidden bg-[#C174F2] p-6 space-y-6">
                    <ul className="flex flex-col space-y-4 text-lg font-semibold">
                        <li><Link href="/" onClick={() => setOpen(false)}>Home</Link></li>
                        <li><Link href="/project" onClick={() => setOpen(false)}>Projects</Link></li>
                        <li><Link href="/events" onClick={() => setOpen(false)}>Events</Link></li>
                        <li><Link href="/news" onClick={() => setOpen(false)}>News</Link></li>
                        <li><Link href="/about" onClick={() => setOpen(false)}>About</Link></li>
                    </ul>
                    <div className="flex flex-col space-y-2">
                        <button className="text-white font-medium">Sign Out</button>
                        <Link href="/toto">
                            <button className="bg-[#D5A8F2] text-white px-4 py-2 rounded-lg font-semibold">
                                Sign In
                            </button>
                        </Link>
                    </div>

                </div>
            )}
        </nav>
    );
};

export default Navbar;
