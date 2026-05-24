"use client";

import React from "react";

import Link from "next/link";

import {
  LayoutDashboard,
  History,
  Sparkles,
  Settings,
  X,
} from "lucide-react";

import {
  usePathname,
} from "next/navigation";

const Sidebar = ({
  openSidebar,
  setOpenSidebar,
}) => {

  const pathname =
    usePathname();

  const menuItems = [

    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },

    {
      name: "Interview History",
      icon: History,
      path: "/dashboard/history",
    },

    {
      name: "AI Feedback",
      icon: Sparkles,
      path: "/dashboard/feedback",
    },

    {
      name: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  return (

    <>

      {/* OVERLAY */}
      {
        openSidebar && (

          <div
            onClick={() =>
              setOpenSidebar(
                false
              )
            }
            className="
              fixed
              inset-0
              bg-black/50
              z-40
            "
          />
        )
      }

      {/* SIDEBAR */}
      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          bg-[#0f172a]
          border-r
          border-gray-800
          z-50
          transform
          transition-transform
          duration-300

          ${
            openSidebar
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
            border-gray-800
          "
        >

          <div>

            <h1
              className="
                text-3xl
                font-extrabold
                text-white
              "
            >

              Interview
              <span
                className="
                  text-blue-500
                "
              >

                IQ

              </span>

            </h1>

            <p
              className="
                text-gray-400
                text-sm
                mt-1
              "
            >

              AI Powered Interview Prep

            </p>

          </div>

          {/* CLOSE */}
          <button
            onClick={() =>
              setOpenSidebar(
                false
              )
            }
            className="
              text-white
            "
          >

            <X size={28} />

          </button>

        </div>

        {/* NAVIGATION */}
        <div
          className="
            p-6
            space-y-3
          "
        >

          {
            menuItems.map(
              (
                item,
                index
              ) => {

                const Icon =
                  item.icon;

                const isActive =
                  pathname ===
                  item.path;

                return (

                  <Link
                    key={index}
                    href={
                      item.path
                    }
                    onClick={() =>
                      setOpenSidebar(
                        false
                      )
                    }
                  >

                    <div
                      className={`
                        flex
                        items-center
                        gap-4
                        px-5
                        py-4
                        rounded-2xl
                        font-semibold
                        transition-all

                        ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-[#111827] hover:text-white"
                        }
                      `}
                    >

                      <Icon
                        size={22}
                      />

                      {item.name}

                    </div>

                  </Link>
                );
              }
            )
          }

        </div>

      </aside>

    </>
  );
};

export default Sidebar;