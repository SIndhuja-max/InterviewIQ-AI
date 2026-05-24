import Link from "next/link";

import { Button } from "@/components/ui/button";

import {
  Brain,
  FileText,
  BarChart3,
  Sparkles,
  Mic,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

import Image from "next/image";

export default function Home() {

  const features = [

    {
      icon: Brain,
      title: "AI Mock Interviews",
      description:
        "Practice technical, HR, and behavioral interviews powered by AI-generated questions and adaptive difficulty.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },

    {
      icon: FileText,
      title: "Resume-Based Questions",
      description:
        "Upload your resume and receive personalized interview questions based on your skills and projects.",
      color: "text-green-400",
      bg: "bg-green-500/10",
    },

    {
      icon: Mic,
      title: "Speech Analysis",
      description:
        "Improve communication confidence using voice recording and AI-powered feedback analysis.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },

    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track interview progress, confidence score, ratings, and improvement using analytics.",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },

    {
      icon: ShieldCheck,
      title: "Smart Interview Flow",
      description:
        "Generate intelligent interview sessions with customizable difficulty and AI evaluation.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },

    {
      icon: Sparkles,
      title: "Professional Experience",
      description:
        "Modern SaaS-style dashboard with notifications, analytics, responsive design, and settings.",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
    },
  ];

  return (

    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-0
          left-0
          w-[500px]
          h-[500px]
          bg-blue-600/20
          blur-[140px]
          rounded-full
        " />

        <div className="
          absolute
          bottom-0
          right-0
          w-[500px]
          h-[500px]
          bg-purple-600/20
          blur-[140px]
          rounded-full
        " />

      </div>

      {/* NAVBAR */}
      <header className="
        border-b
        border-white/10
        sticky
        top-0
        z-50
        bg-black/40
        backdrop-blur-xl
      ">

        <div className="
          max-w-7xl
          mx-auto
          px-6
          py-5
          flex
          items-center
          justify-between
        ">

          {/* LOGO */}
          <div className="flex items-center">

              <Image
              src="/logo.png"
              alt="InterviewIQ AI"
              width={220}
              height={60}
              priority
              className="object-contain"
              />

            <div>

              <h1 className="
                text-xl
                font-bold
              ">
                InterviewIQ AI
              </h1>

              <p className="
                text-xs
                text-gray-400
              ">
                AI Interview Preparation Platform
              </p>

            </div>

          </div>

          {/* AUTH BUTTONS */}
          <div className="flex items-center gap-4">

            <Link href="/sign-in">

              <Button
                variant="outline"
                className="
                  border-gray-700
                  bg-transparent
                  text-white
                  hover:bg-white
                  hover:text-black
                  rounded-xl
                "
              >

                Login

              </Button>

            </Link>

            <Link href="/sign-up">

              <Button className="
                bg-blue-600
                hover:bg-blue-700
                rounded-xl
                px-6
              ">

                Sign Up

              </Button>

            </Link>

          </div>

        </div>

      </header>

      {/* HERO */}
      <section className="
        max-w-7xl
        mx-auto
        px-6
        pt-24
        pb-24
      ">

        <div className="
          grid
          lg:grid-cols-2
          gap-20
          items-center
        ">

          {/* LEFT */}
          <div>

            {/* BADGE */}
            <div className="
              inline-flex
              items-center
              gap-2
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              px-5
              py-2
              rounded-full
              mb-8
            ">

              <Sparkles size={18} />

              AI MockInterview Platform

            </div>

            {/* TITLE */}
            <h1 className="
              text-5xl
              md:text-7xl
              font-black
              leading-tight
            ">

              Master

              <span className="
                bg-gradient-to-r
                from-blue-400
                to-cyan-300
                bg-clip-text
                text-transparent
              ">

                {" "}AI Interviews

              </span>

              <br />

              With Confidence.

            </h1>

            {/* DESCRIPTION */}
            <p className="
              mt-8
              text-gray-400
              text-lg
              leading-8
              max-w-2xl
            ">

              Prepare for technical and HR interviews using AI-generated questions, resume intelligence, voice analysis, and performance tracking.

            </p>

            {/* HIGHLIGHTS */}
            <div className="
              grid
              sm:grid-cols-2
              gap-4
              mt-10
            ">

              {[
                "AI Technical Interviews",
                "Resume-Based Questions",
                "Voice Recording & Feedback",
                "Performance Analytics",
              ].map((item, index) => (

                <div
                  key={index}
                  className="
                    flex
                    items-center
                    gap-3
                    text-gray-300
                  "
                >

                  <CheckCircle2
                    className="text-green-400"
                    size={18}
                  />

                  <span>{item}</span>

                </div>
              ))}

            </div>

            {/* CTA BUTTONS */}
            <div className="
              flex
              flex-wrap
              gap-5
              mt-12
            ">

              <Link href="/sign-up">

                <Button className="
                  bg-blue-600
                  hover:bg-blue-700
                  px-8
                  py-7
                  text-lg
                  rounded-2xl
                ">

                  Get Started

                  <ArrowRight
                    className="ml-2"
                    size={20}
                  />

                </Button>

              </Link>

              <Link href="/sign-in">

                <Button
                  variant="outline"
                  className="
                    border-gray-700
                    bg-transparent
                    text-white
                    hover:bg-white
                    hover:text-black
                    px-8
                    py-7
                    text-lg
                    rounded-2xl
                  "
                >

                  Login

                </Button>

              </Link>

            </div>

          </div>
         {/* RIGHT SIDE WATERMARK */}
<div
  className="
    relative
    hidden
    lg:flex
    items-center
    justify-center
  "
>

   {/* BACKGROUND GLOW */}
  <div
    className="
      absolute
      w-[700px]
      h-[700px]
      bg-blue-500/10
      rounded-full
      blur-3xl
    "
  />

  {/* WATERMARK LOGO */}
  <img
    src="/watermark.png"
    alt="AI Interview"
    className="
      relative
      z-10
      w-[700px]
      object-contain
      drop-shadow-[0_0_40px_rgba(59,130,246,0.35)]
    "
  />

</div> 

        </div>

      </section>

      {/* FEATURES */}
      <section className="
        max-w-7xl
        mx-auto
        px-6
        pb-32
      ">

        <div className="
          text-center
          mb-16
        ">

          <p className="
            text-blue-400
            font-medium
            mb-4
          ">
            FEATURES
          </p>

          <h2 className="
            text-4xl
            md:text-5xl
            font-bold
          ">

            Everything You Need To

            <span className="text-blue-500">

              {" "}Crack Interviews

            </span>

          </h2>

        </div>

        {/* FEATURE GRID */}
        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
        ">

          {features.map((feature, index) => {

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="
                  bg-[#111827]/80
                  border
                  border-gray-800
                  rounded-3xl
                  p-8
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-blue-500/50
                "
              >

                <div className={`
                  ${feature.bg}
                  w-fit
                  p-4
                  rounded-2xl
                  mb-6
                `}>

                  <Icon
                    className={feature.color}
                    size={30}
                  />

                </div>

                <h3 className="
                  text-2xl
                  font-bold
                  mb-4
                ">
                  {feature.title}
                </h3>

                <p className="
                  text-gray-400
                  leading-8
                ">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </section>

    </main>
  );
}