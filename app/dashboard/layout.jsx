"use client";

import React, {
  useState,
} from "react";

import Header
from "./_components/Header";

import Sidebar
from "./_components/Sidebar";

const DashboardLayout = ({
  children,
}) => {

  const [
    openSidebar,
    setOpenSidebar,
  ] = useState(false);

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
      "
    >

      {/* HEADER */}
      <Header
        toggleSidebar={() =>
          setOpenSidebar(
            !openSidebar
          )
        }
      />

      {/* SIDEBAR */}
      <Sidebar
        openSidebar={
          openSidebar
        }
        setOpenSidebar={
          setOpenSidebar
        }
      />

      {/* PAGE CONTENT */}
      <main>

        {children}

      </main>

    </div>
  );
};

export default DashboardLayout;