// // src/components/Sidebar.jsx

// import { forwardRef } from "react";
// import { NavLink} from "react-router-dom";
// import { navbarLinks } from "@/constants";
// import admire from "@/assets/admire.jpg";
// import { cn } from "@/utils/cn";
// import PropTypes from "prop-types";
// import { FiLogOut } from "react-icons/fi"; // Feather Icon for logout
// import { toast } from "react-toastify";

// export const Sidebar = forwardRef(({ collapsed }, ref) => {
   
//     const handleLogout = () => {
//     localStorage.clear();
//     console.log("Logged out");
//     toast.success("Logged out successfully");
//     setTimeout(() => {
//         window.location.replace('/login');
//     }, 2000);
// };


//     return (
//         <aside
//             ref={ref}
//             className={cn(
//                 "fixed z-[100] flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
//                 collapsed ? "md:w-[70px]" : "md:w-[240px]",
//                 collapsed ? "max-md:-left-full" : "max-md:left-0",
//             )}
//         >
//             {/* === Top (Logo) === */}
//             <div className={cn("flex shrink-0 items-center gap-x-3 p-3", collapsed ? "md:justify-center" : "")}>
//                 <img
//                     src={admire}
//                     alt="Logo"
//                     className={cn("w-18 h-8 dark:hidden", collapsed && "md:h-10 md:w-10")}
//                 />
//                 <img
//                     src={admire}
//                     alt="Logo"
//                     className={cn("w-18 hidden h-8 dark:block", collapsed && "md:h-10 md:w-10")}
//                 />
//             </div>

//             {/* === Middle (Scrollable nav items) === */}
//             <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 [scrollbar-width:_thin]">
//                 {navbarLinks.map((item) => {
//                     if (item.links) {
//                         const GroupIcon = item.links[0].icon;
//                         return (
//                             <nav
//                                 key={item.title}
//                                 className={cn("sidebar-group", collapsed && "md:items-center")}
//                             >
//                                 <div className={cn("sidebar-group-title", collapsed && "md:w-auto")}>
//                                     {collapsed ? <GroupIcon size={18} /> : item.title}
//                                 </div>
//                                 {item.links.map((link) => {
//                                     const LinkIcon = link.icon;
//                                     return (
//                                         <NavLink
//                                             key={link.label}
//                                             to={link.path}
//                                             className={cn("sidebar-item", collapsed && "md:w-[45px]")}
//                                         >
//                                             <LinkIcon
//                                                 size={18}
//                                                 className="flex-shrink-0"
//                                             />
//                                             {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
//                                         </NavLink>
//                                     );
//                                 })}
//                             </nav>
//                         );
//                     } else {
//                         const LinkIcon = item.icon;
//                         return (
//                             <NavLink
//                                 key={item.title}
//                                 to={item.path}
//                                 end={item.path === "/"}
//                                 className={cn("sidebar-item", collapsed && "md:w-[45px]")}
//                             >
//                                 <LinkIcon
//                                     size={18}
//                                     className="flex-shrink-0"
//                                 />
//                                 {!collapsed && <p className="whitespace-nowrap">{item.title}</p>}
//                             </NavLink>
//                         );
//                     }
//                 })}
//             </div>

//             {/* === Bottom (Fixed Logout button) === */}
//             <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
//                 <button
//                     onClick={handleLogout}
//                     className={cn(
//                         "sidebar-item w-full text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900",
//                         collapsed && "md:w-[45px] md:justify-center",
//                     )}
//                 >
//                     <FiLogOut
//                         size={18}
//                         className="flex-shrink-0"
//                     />
//                     {!collapsed && <span className="ml-2 whitespace-nowrap">Logout</span>}
//                 </button>
//             </div>
//         </aside>
//     );
// });

// Sidebar.displayName = "Sidebar";

// Sidebar.propTypes = {
//     collapsed: PropTypes.bool,
// };


// src/components/Sidebar.jsx

import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { navbarLinks } from "@/constants";
import admire from "@/assets/admire.jpg";
import { cn } from "@/utils/cn";
import PropTypes from "prop-types";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from "../stores/authStore";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        sessionStorage.clear(); // clears store + sessionStorage
        window.location.href = "/login";
    };

    return (
        <aside
            ref={ref}
            className={cn(
                "fixed z-[100] flex h-full flex-col overflow-hidden border-r border-slate-200 bg-white [transition:_width_300ms_cubic-bezier(0.4,_0,_0.2,_1),_left_300ms_cubic-bezier(0.4,_0,_0.2,_1)] dark:border-slate-700 dark:bg-slate-900",
                collapsed ? "md:w-[70px]" : "md:w-[240px]",
                collapsed ? "max-md:-left-full" : "max-md:left-0",
            )}
        >
            {/* === Top (Logo) === */}
            <div className={cn("flex shrink-0 items-center gap-x-3 p-3", collapsed ? "md:justify-center" : "")}>
                <img
                    src={admire}
                    alt="Logo"
                    className={cn("w-18 h-8 dark:hidden", collapsed && "md:h-10 md:w-10")}
                />
                <img
                    src={admire}
                    alt="Logo"
                    className={cn("w-18 hidden h-8 dark:block", collapsed && "md:h-10 md:w-10")}
                />
            </div>

            {/* === Middle (Scrollable nav items) === */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 [scrollbar-width:_thin]">
                {navbarLinks.map((item) => {
                    if (item.links) {
                        const GroupIcon = item.links[0].icon;
                        return (
                            <nav
                                key={item.title}
                                className={cn("sidebar-group", collapsed && "md:items-center")}
                            >
                                <div className={cn("sidebar-group-title", collapsed && "md:w-auto")}>
                                    {collapsed ? <GroupIcon size={18} /> : item.title}
                                </div>
                                {item.links.map((link) => {
                                    const LinkIcon = link.icon;
                                    return (
                                        <NavLink
                                            key={link.label}
                                            to={link.path}
                                            className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                                        >
                                            <LinkIcon
                                                size={18}
                                                className="flex-shrink-0"
                                            />
                                            {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                                        </NavLink>
                                    );
                                })}
                            </nav>
                        );
                    } else {
                        const LinkIcon = item.icon;
                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                end={item.path === "/"}
                                className={cn("sidebar-item", collapsed && "md:w-[45px]")}
                            >
                                <LinkIcon
                                    size={18}
                                    className="flex-shrink-0"
                                />
                                {!collapsed && <p className="whitespace-nowrap">{item.title}</p>}
                            </NavLink>
                        );
                    }
                })}
            </div>

            {/* === Bottom (Fixed Logout button) === */}
            <div className="shrink-0 border-t border-slate-200 p-3 dark:border-slate-700">
                <button
                    onClick={handleLogout}
                    className={cn(
                        "sidebar-item w-full text-left text-red-500 hover:bg-red-100 dark:hover:bg-red-900",
                        collapsed && "md:w-[45px] md:justify-center",
                    )}
                >
                    <FiLogOut
                        size={18}
                        className="flex-shrink-0"
                    />
                    {!collapsed && <span className="ml-2 whitespace-nowrap">Logout</span>}
                </button>
            </div>
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
    collapsed: PropTypes.bool,
};