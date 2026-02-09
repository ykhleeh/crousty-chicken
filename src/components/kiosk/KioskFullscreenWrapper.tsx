"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface KioskFullscreenWrapperProps {
  children: React.ReactNode;
}

export default function KioskFullscreenWrapper({
  children,
}: KioskFullscreenWrapperProps) {
  const t = useTranslations("Kiosk");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [exitTaps, setExitTaps] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Check if we're in fullscreen
  const checkFullscreen = useCallback(() => {
    const isFs = !!(
      document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement ||
      (document as unknown as { msFullscreenElement?: Element }).msFullscreenElement
    );
    setIsFullscreen(isFs);
    return isFs;
  }, []);

  // Request fullscreen
  const enterFullscreen = async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as unknown as { webkitRequestFullscreen?: () => Promise<void> }).webkitRequestFullscreen) {
        await (elem as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((elem as unknown as { mozRequestFullScreen?: () => Promise<void> }).mozRequestFullScreen) {
        await (elem as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
      } else if ((elem as unknown as { msRequestFullscreen?: () => Promise<void> }).msRequestFullscreen) {
        await (elem as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
      setShowSplash(false);
      setIsFullscreen(true);
    } catch (err) {
      console.error("Fullscreen error:", err);
      // Even if fullscreen fails, allow access
      setShowSplash(false);
    }
  };

  // Exit fullscreen (for staff)
  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        await (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as unknown as { mozCancelFullScreen?: () => Promise<void> }).mozCancelFullScreen) {
        await (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
      } else if ((document as unknown as { msExitFullscreen?: () => Promise<void> }).msExitFullscreen) {
        await (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    } catch (err) {
      console.error("Exit fullscreen error:", err);
    }
  };

  // Hidden exit: tap logo 5 times quickly
  const handleLogoTap = () => {
    const now = Date.now();
    if (now - lastTapTime < 500) {
      const newTaps = exitTaps + 1;
      setExitTaps(newTaps);
      if (newTaps >= 5) {
        exitFullscreen();
        setExitTaps(0);
      }
    } else {
      setExitTaps(1);
    }
    setLastTapTime(now);
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      checkFullscreen();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    // Check initial state
    checkFullscreen();

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [checkFullscreen]);

  // Splash screen to enter fullscreen
  if (showSplash) {
    return (
      <div
        className="min-h-screen bg-black flex flex-col items-center justify-center px-4 cursor-pointer"
        onClick={enterFullscreen}
      >
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Crousty Chicken"
              width={200}
              height={200}
              className="mx-auto"
              onError={(e) => {
                // Hide image if not found
                e.currentTarget.style.display = "none";
              }}
            />
          </div>

          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-golden mb-4">
            Crousty Chicken
          </h1>

          <p className="text-white/70 text-xl mb-12">{t("welcomeSubtitle")}</p>

          {/* Animated tap indicator */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full border-4 border-golden flex items-center justify-center animate-pulse">
              <svg
                className="w-12 h-12 text-golden"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
          </div>

          <p className="text-golden text-lg mt-8 animate-bounce">
            {t("tapToStart")}
          </p>
        </div>
      </div>
    );
  }

  // Show re-enter fullscreen prompt if exited
  if (!isFullscreen) {
    return (
      <div className="min-h-screen bg-black">
        {/* Banner to re-enter fullscreen */}
        <div
          className="bg-golden text-black py-3 px-4 text-center cursor-pointer"
          onClick={enterFullscreen}
        >
          <p className="font-bold">{t("reenterFullscreen")}</p>
        </div>

        {/* Children with exit tap handler on logo area */}
        <div className="relative">
          {/* Hidden exit tap zone (top-left corner) */}
          <div
            className="absolute top-0 left-0 w-20 h-20 z-50"
            onClick={handleLogoTap}
          />
          {children}
        </div>
      </div>
    );
  }

  // Fullscreen mode - render children with hidden exit
  return (
    <div className="relative">
      {/* Hidden exit tap zone (top-left corner) - tap 5 times to exit */}
      <div
        className="absolute top-0 left-0 w-20 h-20 z-50"
        onClick={handleLogoTap}
      />
      {children}
    </div>
  );
}
