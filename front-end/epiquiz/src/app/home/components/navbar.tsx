"use client"

import Link from "next/link"

export default function Navbar () {
    return (
        <nav className="w-full h-23 bg-white">
            <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16 font-[Open Sans]">
                <Link href="/">
                    <h1 className="Bold text-[#1C7CE3]">EpiQUIZ</h1>
                </Link>

            </div>
        </nav>
    );
}