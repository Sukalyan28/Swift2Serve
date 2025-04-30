import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu } from "./../Data/Data";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
//
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  // logout funtion
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  //===========doc menu=============
  const workerMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa fa-thin fa-house",
    },
    {
      name: "Appointments",
      path: "/worker-appointments",
      icon: "fa fa-thin fa-list",
    },

    {
      name: "Profile",
      path: `/worker/profile/${user?._id}`,
      icon: "fa fa-thin fa-user",
    },
    
    //   {
    //     name: "Logout",
    //     path: "/logout",
    //     icon: "fa fa-thin fa-right-from-bracket",
    //   },
  ];

  const userMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa fa-thin fa-house"
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "fa fa-thin fa-list"
    },
    {
      name: "Apply Worker",
      path: "/apply-worker",
      icon: "fa fa-thin fa-user"
    },
    {
      name: "Profile",
      path: `/user/profile/${user?._id}`,
      icon: "fa fa-thin fa-user"
    }
    //   {
    //     name: "Logout",
    //     path: "/logout",
    //     icon: "fa fa-thin fa-right-from-bracket",
    //   },
  ];

  // redering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isWorker
    ? workerMenu
    : userMenu;
  return (
    <>
      
        <div className=" w-full  px-3 py-4 flex gap-4" >
          <div className="sidebar">
            <div className="logo">
              <h6>Menu</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div  className={`menu-item ${isActive && "active"}`} onClick={()=>navigate(menu.path)}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
        
           
            <div className=" w-[80%] py-4 h-max min-h-[100vh]  rounded-lg shadow-md bg-[#fff4c9]">
            <div className=" flex justify-between px-4 items-center border-b border-gray-300 pb-3">
            <h1 className=" text-center font-bold text-4xl font-inter">Serve2Ease</h1>
            <div className=" text-right">
            <i class="fa-solid fa-bell text-black text-xl cursor-pointer mr-4 relative" onClick={() => {
                    navigate("/notification");
                  }}>

                <span
                 className={` absolute -top-3 left-2 px-[8px] py-[2px] rounded-full text-sm bg-red-5 text-white ${user && user.notification.length>0?"":" hidden"}`}
               >
                  {user && user.notification.length>0 && user.notification.length}
               </span>
                  </i>
             
                 
               
                
                {
                  user?.isWorker && <Link to={`/worker/profile/${user?._id}`} className=" text-xl"><i className="fa fa-thin fa-user"></i></Link>
                }
                {
                  !(user?.isWorker) && <Link to={`/user/profile/${user?._id}`} className=" text-xl bg-sky-500 px-2 py-1 border-1 text-white border-sky-600 rounded-full">{user?.name[0]}</Link>
                }
              </div>
              </div>
              
            

          
              
              <div> <p className=" text-3xl font-semibold text-center mt-3">Welcome {user?.name}</p>
               
              </div>
              <div className=" px-4">{children}</div>
              </div>
          
        </div>
     
    </>
  );
};

export default Layout;
