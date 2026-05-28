"use client";

import React, {
  useState,
} from "react";

import Link from "next/link";

import {
  Briefcase,
  CalendarDays,
  Code2,
  MoreVertical,
  Trash2,
} from "lucide-react";

import {
  useRouter,
} from "next/navigation";

const InterviewCard = ({
  interview,
}) => {

  const router =
    useRouter();

  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  // =========================
  // DELETE INTERVIEW
  // =========================
  const DeleteInterview =
    async () => {

      const confirmDelete =
        confirm(
          "Are you sure you want to delete this interview?"
        );

      if (!confirmDelete)
        return;

      try {

        setDeleting(true);

        const response =
          await fetch(
            `/api/delete-interview/${interview?.id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        console.log(
          "DELETE RESPONSE:",
          data
        );

        if (data.success) {

          window.location.reload();

        } else {

          alert(
            "Failed to delete interview"
          );
        }

      } catch (error) {

        console.log(
          "DELETE ERROR:",
          error
        );

        alert(
          "Delete failed"
        );
      }

      setDeleting(false);
    };

  return (

    <div
      className="
        relative
        bg-[#111827]
        border
        border-gray-800
        rounded-3xl
        p-6
        hover:border-blue-500
        transition-all
        duration-300
      "
    >

      {/* TOP */}
      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <div
          className="
            bg-blue-500/20
            p-3
            rounded-2xl
          "
        >

          <Briefcase
            className="
              text-blue-400
            "
          />

        </div>

        <div className="relative">

          {/* 3 DOT BUTTON */}
          <button
            onClick={() =>
              setShowMenu(
                !showMenu
              )
            }
            className="
              p-2
              rounded-xl
              hover:bg-gray-800
              transition-all
            "
          >

            <MoreVertical
              className="
                text-gray-400
              "
            />

          </button>

          {/* DROPDOWN */}
          {
            showMenu && (

              <div
                className="
                  absolute
                  right-0
                  top-12
                  bg-[#0f172a]
                  border
                  border-gray-700
                  rounded-2xl
                  p-2
                  w-40
                  z-50
                "
              >

                <button
                  onClick={
                    DeleteInterview
                  }
                  disabled={
                    deleting
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-2
                    px-4
                    py-3
                    rounded-xl
                    hover:bg-red-500/20
                    text-red-400
                    transition-all
                  "
                >

                  <Trash2 size={16} />

                  {
                    deleting
                      ? "Deleting..."
                      : "Delete"
                  }

                </button>

              </div>
            )
          }

        </div>

      </div>

      {/* ROLE */}
      <h2
        className="
          text-2xl
          font-bold
          text-white
          mt-6
        "
      >

        {interview?.jobPosition}

      </h2>

      {/* EXPERIENCE */}
      <p
        className="
          text-gray-400
          mt-2
        "
      >

        {
          interview?.jobExperience
        } Years Experience

      </p>

      {/* TECH STACK */}
      <div
        className="
          flex
          items-center
          gap-2
          mt-4
          text-sm
          text-gray-300
        "
      >

        <Code2 size={16} />

        <span>

          {interview?.jobDesc}

        </span>

      </div>

      {/* DATE */}
      <div
        className="
          flex
          items-center
          gap-2
          mt-3
          text-sm
          text-gray-500
        "
      >

        <CalendarDays
          size={16}
        />

        <span>

          Created Recently

        </span>

      </div>

      {/* BUTTONS */}
      <div
        className="
          flex
          gap-3
          mt-6
        "
      >

        <Link
          href={`/dashboard/interview/${interview?.id}`}
          className="flex-1"
        >

          <button
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              transition-all
              text-white
              py-3
              rounded-2xl
              font-medium
            "
          >

            Start

          </button>

        </Link>

        <Link
          href={`/dashboard/interview/${interview?.id}`}
          className="flex-1"
        >

          <button
            className="
              w-full
              border
              border-gray-700
              hover:border-blue-500
              transition-all
              text-white
              py-3
              rounded-2xl
              font-medium
            "
          >

            Details

          </button>

        </Link>

      </div>

    </div>
  );
};

export default InterviewCard;