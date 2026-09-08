"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Turtle } from "lucide-react";
import { motion } from "framer-motion";
import { speechEngine } from "@/lib/speech";
import { soundEffects } from "@/lib/sound";

interface AudioSpeakerButtonProps {
  text: string;
  lang?: string;
  size?: "sm" | "md" | "lg";
  showSlowOption?: boolean;
  className?: string;
}

export const AudioSpeakerButton: React.FC<AudioSpeakerButtonProps> = ({
  text,
  lang,
  size = "md",
  showSlowOption = true,
  className = "",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSlowMode, setIsSlowMode] = useState(false);

  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  const handleSpeak = (slow: boolean) => {
    if (!text) return;

    soundEffects.playClick();
    setIsPlaying(true);
    setIsSlowMode(slow);

    speechEngine.speak(text, {
      lang,
      slow,
      onStart: () => setIsPlaying(true),
      onEnd: () => {
        setIsPlaying(false);
        setIsSlowMode(false);
      },
      onError: () => {
        setIsPlaying(false);
        setIsSlowMode(false);
      },
    });
  };

  const sizeClasses = {
    sm: "w-8 h-8 rounded-xl",
    md: "w-11 h-11 rounded-2xl",
    lg: "w-14 h-14 rounded-2xl",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Primary Speaker Button */}
      <motion.button
        type="button"
        onClick={() => handleSpeak(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative flex items-center justify-center shrink-0 transition-all border-b-4 active:translate-y-0.5 active:border-b-2 cursor-pointer ${
          sizeClasses[size]
        } ${
          isPlaying && !isSlowMode
            ? "bg-[#1cb0f6] border-[#1899d6] text-white shadow-lg shadow-[#1cb0f6]/30 ring-4 ring-[#1cb0f6]/25"
            : "bg-[#1cb0f6]/20 border-[#1cb0f6]/50 text-[#1cb0f6] hover:bg-[#1cb0f6]/30 hover:border-[#1cb0f6]"
        }`}
        title={`Listen to "${text}"`}
        aria-label="Listen to audio prompt"
      >
        <Volume2 className={`${iconSizes[size]} ${isPlaying && !isSlowMode ? "animate-pulse" : ""}`} />
        {isPlaying && !isSlowMode && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1cb0f6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1cb0f6]"></span>
          </span>
        )}
      </motion.button>

      {/* Slow Pronunciation Mode (Duolingo Turtle) */}
      {showSlowOption && (
        <motion.button
          type="button"
          onClick={() => handleSpeak(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center justify-center shrink-0 transition-all border-b-4 active:translate-y-0.5 active:border-b-2 cursor-pointer ${
            sizeClasses[size]
          } ${
            isPlaying && isSlowMode
              ? "bg-[#1cb0f6] border-[#1899d6] text-white shadow-lg shadow-[#1cb0f6]/30 ring-4 ring-[#1cb0f6]/25"
              : "bg-[#1cb0f6]/10 border-[#1cb0f6]/30 text-[#1cb0f6]/80 hover:bg-[#1cb0f6]/20 hover:text-[#1cb0f6]"
          }`}
          title="Listen slowly"
          aria-label="Listen slowly"
        >
          <Turtle className={iconSizes[size]} />
        </motion.button>
      )}
    </div>
  );
};
