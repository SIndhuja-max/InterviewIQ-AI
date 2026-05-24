"use client";

import React, {
  useState,
  useEffect,
} from "react";

import {
  User,
  Bell,
  Brain,
} from "lucide-react";

import {
  UserButton,
  useUser,
} from "@clerk/nextjs";

import { db }
from "@/utils/db";

import {
  UserSettings,
} from "@/utils/schema";

import {
  eq,
} from "drizzle-orm";

import {
  RequestNotificationPermission,
  ShowNotification,
} from "@/utils/notifications";

const SettingsPage = () => {

  const { user } =
    useUser();

  const [
    difficulty,
    setDifficulty,
  ] = useState(
    "Intermediate"
  );

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    aiFeedback,
    setAiFeedback,
  ] = useState(true);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // FETCH SETTINGS
  useEffect(() => {

    if (user) {

      GetUserSettings();
    }

  }, [user]);

  const GetUserSettings =
    async () => {

      try {

        const email =
          user
            ?.primaryEmailAddress
            ?.emailAddress;

        const result =
          await db
            .select()
            .from(
              UserSettings
            )
            .where(
              eq(
                UserSettings.userEmail,
                email
              )
            );

        if (
          result.length > 0
        ) {

          const settings =
            result[0];

          setDifficulty(
            settings.difficulty
          );

          setNotifications(
            settings.notifications ===
              "enabled"
          );

          setAiFeedback(
            settings.aiFeedback ===
              "enabled"
          );

        } else {

          await db
            .insert(
              UserSettings
            )
            .values({

              userEmail:
                email,

              difficulty:
                "Intermediate",

              notifications:
                "enabled",

              aiFeedback:
                "enabled",
            });
        }

      } catch (error) {

        console.log(
          "SETTINGS ERROR:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  // SAVE SETTINGS
  const SaveSettings =
    async (
      updatedValues
    ) => {

      try {

        const email =
          user
            ?.primaryEmailAddress
            ?.emailAddress;

        await db
          .update(
            UserSettings
          )
          .set(
            updatedValues
          )
          .where(
            eq(
              UserSettings.userEmail,
              email
            )
          );

      } catch (error) {

        console.log(
          "SAVE SETTINGS ERROR:",
          error
        );
      }
    };

  // DIFFICULTY
  const HandleDifficulty =
    async (value) => {

      setDifficulty(value);

      await SaveSettings({
        difficulty:
          value,
      });
    };

  // NOTIFICATIONS
  const ToggleNotifications =
  async () => {

    const newValue =
      !notifications;

    // ENABLE
    if (newValue) {

      const granted =
        await RequestNotificationPermission();

      if (!granted) {

        alert(
          "Notification permission denied"
        );

        return;
      }

      ShowNotification(
        "Interview Alerts Enabled 🚀",
        "You will now receive interview reminders."
      );
    }

    setNotifications(
      newValue
    );

    await SaveSettings({

      notifications:
        newValue
          ? "enabled"
          : "disabled",
    });
  };
  // AI FEEDBACK
  const ToggleAiFeedback =
    async () => {

      const newValue =
        !aiFeedback;

      setAiFeedback(
        newValue
      );

      await SaveSettings({

        aiFeedback:
          newValue
            ? "enabled"
            : "disabled",
      });
    };

  // LOADING
  if (loading) {

    return (

      <div
        className="
          text-white
          p-10
        "
      >

        Loading Settings...

      </div>
    );
  }

  return (

    <div
      className="
        min-h-screen
        bg-black
        text-white
        p-8
      "
    >

      {/* HEADER */}
      <div className="mb-10">

        <h1
          className="
            text-4xl
            font-bold
          "
        >

          Settings

        </h1>

        <p
          className="
            text-gray-400
            mt-2
          "
        >

          Manage your interview
          preferences and
          application settings.

        </p>

      </div>

      {/* CONTAINER */}
      <div
      className="
      w-full
      max-w-6xl
      mx-auto
      "
      >

      <div className="space-y-8">

          {/* ACCOUNT */}
          <div
            className="
              bg-[#111827]
              border
              border-gray-800
              rounded-3xl
              p-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-8
              "
            >

              <div
                className="
                  bg-blue-500/20
                  p-3
                  rounded-2xl
                "
              >

                <User
                  className="
                    text-blue-400
                  "
                />

              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >

                  Account Settings

                </h2>

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >

                  Manage your Clerk account

                </p>

              </div>

            </div>

            <div
              className="
                w-full
                flex
                items-center
                justify-between
                bg-black/30
                border
                border-gray-700
                rounded-2xl
                p-5
              "
            >

              <div
                className="
                  text-left
                "
              >

                <h3
                  className="
                    font-semibold
                    text-lg
                  "
                >

                  Account Settings

                </h3>

                <p
                  className="
                    text-gray-400
                    text-sm
                    mt-1
                  "
                >

                  Manage profile,
                  email,
                  password,
                  and security

                </p>

              </div>

              <UserButton
                afterSignOutUrl="/"
              />

            </div>

          </div>

          {/* INTERVIEW */}
          <div
            className="
              bg-[#111827]
              border
              border-gray-800
              rounded-3xl
              p-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-8
              "
            >

              <div
                className="
                  bg-purple-500/20
                  p-3
                  rounded-2xl
                "
              >

                <Brain
                  className="
                    text-purple-400
                  "
                />

              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >

                  Interview Preferences

                </h2>

                <p
                  className="
                    text-gray-400
                    text-sm
                  "
                >

                  AI interview behavior settings

                </p>

              </div>

            </div>

            <div
              className="
                space-y-6
              "
            >

              {/* DIFFICULTY */}
              <div>

                <label
                  className="
                    block
                    mb-3
                    font-medium
                  "
                >

                  Interview Difficulty

                </label>

                <select
                  value={
                    difficulty
                  }
                  onChange={(e) =>
                    HandleDifficulty(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    bg-black
                    border
                    border-gray-700
                    rounded-2xl
                    px-5
                    py-4
                    focus:outline-none
                  "
                >

                  <option>
                    Beginner
                  </option>

                  <option>
                    Intermediate
                  </option>

                  <option>
                    Advanced
                  </option>

                </select>

              </div>

              {/* AI FEEDBACK */}
              <div
                className="
                  flex
                  items-center
                  justify-between
                  bg-black/30
                  border
                  border-gray-700
                  rounded-2xl
                  p-5
                "
              >

                <div>

                  <h3
                    className="
                      font-semibold
                    "
                  >

                    Detailed AI Feedback

                  </h3>

                  <p
                    className="
                      text-gray-400
                      text-sm
                    "
                  >

                    Enable advanced AI analysis

                  </p>

                </div>

                <button
                  onClick={
                    ToggleAiFeedback
                  }
                  className={`
                    px-5
                    py-2
                    rounded-xl
                    transition-all

                    ${
                      aiFeedback
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  `}
                >

                  {
                    aiFeedback
                      ? "Enabled"
                      : "Disabled"
                  }

                </button>

              </div>

            </div>

          </div>

          {/* NOTIFICATIONS */}
          <div
            className="
              bg-[#111827]
              border
              border-gray-800
              rounded-3xl
              p-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
                mb-8
              "
            >

              <div
                className="
                  bg-yellow-500/20
                  p-3
                  rounded-2xl
                "
              >

                <Bell
                  className="
                    text-yellow-400
                  "
                />

              </div>

              <div>

                <h2
                  className="
                    text-2xl
                    font-bold
                  "
                >

                  Notifications

                </h2>

              </div>

            </div>

            <div
              className="
                flex
                items-center
                justify-between
                bg-black/30
                border
                border-gray-700
                rounded-2xl
                p-5
              "
            >

              <div>

                <h3
                  className="
                    font-semibold
                  "
                >

                  Interview Alerts

                </h3>

              </div>

              <button
                onClick={
                  ToggleNotifications
                }
                className={`
                  px-5
                  py-2
                  rounded-xl
                  transition-all

                  ${
                    notifications
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                `}
              >

                {
                  notifications
                    ? "Enabled"
                    : "Disabled"
                }

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SettingsPage;