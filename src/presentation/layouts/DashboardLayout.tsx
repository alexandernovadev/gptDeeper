import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarMenuItem } from "../components";
import { LearnerRoutes } from "../router/learnerLangRoutes";
import { menuRoutes } from "../router/gptRoutes";

export const DashboardLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <main className="flex flex-col sm:flex-row mt-7">
      {/* Mobile Menu Button */}
      <button
        className="absolute sm:hidden p-4 bg-indigo-500 text-white rounded-full m-3 self-end"
        onClick={toggleMenu}
      >
        {isMenuOpen ? "Close Menu" : "Open Menu"}
      </button>

      {/* Sidebar Menu */}
      <nav
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col ml-5 w-[370px] h-[95vh] bg-white bg-opacity-10 p-5 rounded-3xl transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 overflow-auto`}
      >
        <h1 className="font-bold text-lg lg:text-3xl bg-gradient-to-br from-white via-white/50 bg-clip-text text-transparent">
          OPENIA<span className="text-indigo-500">.</span>
        </h1>

        <div className="border-gray-700 border my-3" />
        {menuRoutes.map((option) => (
          <SidebarMenuItem key={option.to} {...option} />
        ))}
        <span>
          Learner GPT <hr />
        </span>
        {LearnerRoutes.map((option) => (
          <SidebarMenuItem key={option.to} {...option} />
        ))}
      </nav>

      {/* Main Content */}
      <section className="mx-3 sm:mx-10 flex flex-col w-full sm:w-[calc(100%-370px)] h-[95vh] bg-white bg-opacity-10 p-5 rounded-3xl">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-auto h-full p-1">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
