import React from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, user }) => {
    const location = useLocation();
    const showNavbar = user && location.pathname !== '/map';

    return (
        <div className="min-h-screen transition-colors duration-300">
            {showNavbar && <Navbar user={user} />}
            <main className={showNavbar ? "pt-16" : ""}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
