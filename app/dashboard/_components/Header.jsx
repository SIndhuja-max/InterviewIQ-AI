"use client";

import React from "react";

import Link from "next/link";

import Image from "next/image";

import {
  UserButton,
} from "@clerk/nextjs";

import {
  Menu,
} from "lucide-react";

const Header = ({
  toggleSidebar,
}) => {

  return (

    <header className="
      flex
      items-center
      justify-between
      px-6
      py-4
      bg-[#111827]
      border-b
      border-gray-800
      sticky
      top-0
      z-50
    ">

      {/* LEFT */}
      <div className="
        flex
        items-center
        gap-4
      ">

        {/* MENU */}
        <button
          onClick={toggleSidebar}
          className="
            text-white
          "
        >

          <Menu size={30} />

        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3">

  <img
    src="/logo.png"
    alt="InterviewIQ Logo"
    className="
      w-10
      h-10
      object-contain
    "
  />

  <div className="hidden md:block">

    <h1
      className="
        text-white
        text-xl
        font-bold
        leading-none
      "
    >
      InterviewIQ AI
    </h1>

    <p
      className="
        text-gray-400
        text-xs
        mt-1
      "
    >
      AI Interview Platform
    </p>

  </div>

</div>

      </div>

      {/* RIGHT */}
      <div className="
        flex
        items-center
        gap-5
      ">

        <UserButton
          afterSignOutUrl="/"
        />

      </div>

    </header>
  );
};

export default Header;