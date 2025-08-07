'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Sidebar = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    // Set initial state on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <div
          className="fixed top-4 left-4 z-50 cursor-pointer text-2xl"
          onClick={toggleSidebar}
        >
          &#9776;
        </div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white font-bold shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {isMobile && (
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={toggleSidebar}
          >
            &times;
          </button>
        )}
        
        <div className="p-2 m-10 flex justify-center items-center h-20">
          <Image src="/ExpenseTrackerLogoWhite.png" alt="Sample Image" width={400} height={200}/>
        </div>

        <nav className="mt-8">
          <ul className="space-y-2 text-lg">
            <li>
              <Link
                href="/"
                className="flex gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Image src="/Dashboard.svg" alt="Dashboard" width={25} height={25}/>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/metadata"
                className="flex gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Image src="/Expenses.svg" alt="Expenses" width={25} height={25}/>
                Expenses
              </Link>
            </li>
            <li>
              <Link
                href="/metadata/device-center"
                className="flex gap-2 py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <Image src="/Settings.svg" alt="Settings" width={25} height={25}/>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;