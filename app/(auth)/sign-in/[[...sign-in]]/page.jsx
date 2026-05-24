"use client";

import { SignIn } from "@clerk/nextjs";

export default function Page() {

  return (

    <section
      className="
        relative
        min-h-screen
        bg-black
        overflow-hidden
        flex
        items-center
        justify-center
      "
    >

      {/* BACKGROUND GRADIENT */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-[#050816]
          via-black
          to-[#071129]
        "
      />

      {/* BIG BLUE GLOW */}
      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[900px]
          h-[900px]
          bg-blue-500/10
          rounded-full
          blur-3xl
        "
      />

      {/* WATERMARK IMAGE */}
       {/* FULLSCREEN WATERMARK */}
<div
  className="
    absolute
    inset-0
    flex
    items-center
    justify-center
    pointer-events-none
    overflow-hidden
  "
>

  <img
    src="/watermark1.png"
    alt="Watermark"
    className="
      w-[1400px]
      max-w-none
      opacity-[0.22]
      object-contain
      select-none
      blur-[0.4px]
      scale-125
      drop-shadow-[0_0_180px_rgba(59,130,246,0.45)]
    "
  />

</div>

      {/* SIGNIN CARD */}
      <div
        className="
          relative
          z-10
          p-4
          rounded-3xl
          border
          border-blue-500/20
          bg-[#071129]/55
          backdrop-blur-xl
          shadow-[0_0_80px_rgba(59,130,246,0.18)]
        "
      >

        <SignIn
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/dashboard"
        />

      </div>

    </section>
  );
}