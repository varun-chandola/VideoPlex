import { Outlet } from "react-router-dom";
import SidebarPanel from "./SideBar";
import Navbar from "./Navbar";

const Layout = () => {
    return (
        <>
            <Navbar />
            <div className="app-container flex">
                <SidebarPanel />  
                <div className="page-content flex-1">
                    <Outlet /> 
                </div>
            </div>
        </>
    );
};

export default Layout;
