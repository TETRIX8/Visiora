"use client"

import React from "react"
import { SparklesIcon, Linkedin, Github, Twitter } from "lucide-react"

import { Badge } from "./badge"

const SocialButton = ({ icon: Icon, label, href, className = "" }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`group inline-flex items-center gap-3 md:gap-4 px-4 py-3 md:px-6 md:py-4 bg-slate-200/50 dark:bg-white/10 rounded-2xl md:rounded-3xl border border-slate-300/50 dark:border-white/20 hover:border-slate-400/60 dark:hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer ${className}`}
  >
    <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-black dark:bg-white flex items-center justify-center transition-all duration-500 ease-in-out group-hover:bg-white dark:group-hover:bg-black">
      <Icon className="w-4 h-4 md:w-6 md:h-6 text-white dark:text-black transition-all duration-500 ease-in-out group-hover:text-black dark:group-hover:text-white" />
    </div>
    <span className="text-sm md:text-xl font-semibold text-black dark:text-white uppercase tracking-wide">
      {label}
    </span>
  </a>
)

export function SocialLinksDemo() {
  return (
    <section className="mx-auto mt-24 mb-16 w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm dark:border-white/5 md:rounded-t-[44px]">
      <div className="relative mx-auto w-full rounded-[24px] border border-black/5 bg-neutral-800/5 shadow-sm dark:border-white/5 md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px]">
        <article className="z-50 mt-6 md:mt-8 flex flex-col items-center justify-center">
          <Badge
            variant="outline"
            className="mb-4 rounded-[14px] border border-black/10 bg-white text-xs md:text-sm dark:border-white/5 dark:bg-neutral-800/5"
          >
            <SparklesIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 fill-[#EEBDE0] stroke-1 text-neutral-800 dark:text-neutral-200" />
            Connect With Me
          </Badge>
        </article>
        
        <section className="h-full px-8 pb-6 md:pb-12">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 items-center justify-center flex-wrap">
            <SocialButton 
              icon={Linkedin}
              label="LinkedIn"
              href="https://linkedin.com/in/kandariarjun"
            />
            <SocialButton 
              icon={Github}
              label="GitHub"
              href="https://github.com/Kandariarjun07/"
            />
            <SocialButton 
              icon={Twitter}
              label="Twitter"
              href="https://x.com/kandari_arjun"
            />
          </div>
        </section>
      </div>
    </section>
  )
}
