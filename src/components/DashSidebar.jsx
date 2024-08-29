import { useEffect, useState } from "react";
import { useRef } from "react";

import { motion } from "framer-motion";
import SubMenu from "./SubMenu";
// * React icons
import { IoIosArrowBack } from "react-icons/io";
import { SlSettings } from "react-icons/sl";
import { AiOutlineAppstore } from "react-icons/ai";
import { BsPerson } from "react-icons/bs";
import { HiOutlineDatabase } from "react-icons/hi";
import { RiBuilding3Line } from "react-icons/ri";
import { useMediaQuery } from "react-responsive";
import { MdMenu } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" });
  const [open, setOpen] = useState(isTabletMid ? false : true);
  const { currentUser } = useSelector((state) => state.user);
  const sidebarRef = useRef();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [isTabletMid]);

  useEffect(() => {
    isTabletMid && setOpen(false);
  }, [pathname]);

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "20rem", // Increased width
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "20rem", // Increased width
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      };

  const subMenusList = [
    {
      name: "Customer Lead",
      icon: RiBuilding3Line,
      menus: ["CreateLead", "ShowLeads"],
    },
  ];

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 max-h-screen z-[998] bg-black/50 ${
          open ? "block" : "hidden"
        } `}
      ></div>
      <motion.div
        ref={sidebarRef}
        variants={Nav_animation}
        initial={{ x: isTabletMid ? -250 : 0 }}
        animate={open ? "open" : "closed"}
        className="bg-white text-gray shadow-xl z-[999] max-w-[20rem] w-[20rem] 
            overflow-hidden md:relative fixed h-screen"
      >
        <div className="flex items-center gap-2.5 font-medium border-b py-3 border-slate-300 mx-3">
          <img
            src="https://static.vecteezy.com/system/resources/previews/018/869/765/non_2x/male-customer-support-png.png"
            width={45}
            alt=""
          />
          <span className="text-xl whitespace-pre">
            Welcome {currentUser.role === "admin" ? "Admin" : currentUser.username}
          </span>
        </div>

        <div className="flex flex-col h-full">
          <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1 font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100 md:h-[68%] h-[70%]">
            <li>
              <NavLink to={"/"} className="link">
                <AiOutlineAppstore size={23} className="min-w-max" />
                Home
              </NavLink>
            </li>
            {currentUser.role === "admin" && (
              <li>
                <NavLink to={"/customer"} className="link">
                  <BsPerson size={23} className="min-w-max" />
                  Customer
                </NavLink>

                <NavLink to={"/engineer"} className="link">
                  <HiOutlineDatabase size={23} className="min-w-max" />
                  Engineer
                </NavLink>
              </li>
            )}
            <li></li>

            <li>
              <NavLink to={"/track"} className="link">
                <HiOutlineDatabase size={23} className="min-w-max" />
                Track Status
              </NavLink>
            </li>
            <li>
              <NavLink to={"/about"} className="link">
                <HiOutlineDatabase size={23} className="min-w-max" />
                About
              </NavLink>
            </li>

            {(open || isTabletMid) && currentUser.role === "admin" && (
              <div className="border-y py-5 border-slate-300">
                <small className="pl-3 text-slate-500 inline-block mb-2">
                  Product categories
                </small>
                {subMenusList?.map((menu) => (
                  <div
                    key={menu.name}
                    className="flex flex-col gap-1 font-Montserrat"
                  >
                    <SubMenu data={menu} />
                  </div>
                ))}
              </div>
            )}
            <li>
              <NavLink to={"/profile"} className="link">
                <SlSettings size={23} className="min-w-max" />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
        <motion.div
          onClick={() => {
            setOpen(!open);
          }}
          animate={
            open
              ? {
                  x: -10,
                  y: -50,
                  rotate: 0,
                }
              : {
                  x: -10,
                  y: -150,
                  rotate: 180,
                }
          }
          transition={{ duration: 0 }}
          className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-20 cursor-pointer"
        >
          <IoIosArrowBack size={25} />
        </motion.div>
      </motion.div>
      <div className="m-3 md:hidden" onClick={() => setOpen(true)}>
        <MdMenu size={25} />
      </div>
    </div>
  );
};

export default Sidebar;