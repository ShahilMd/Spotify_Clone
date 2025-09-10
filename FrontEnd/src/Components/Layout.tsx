import Sidebar from "./Sidebar.tsx";
import Navbar from "./Navbar.tsx";
import  type {ReactNode} from "react";
import React from "react";

interface LayoutProps {
    children: ReactNode;
}

const Layout:React.FC<LayoutProps> = ({children}) => {
    return (
        <div className={'h-screen'}>
            <div className={'h-[90%] flex'}>
                <Sidebar/>
                <div className={'w-full m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0'}>
                    <Navbar/>
                    {children}
                </div>

            </div>

        </div>
    );
}

export default Layout;
