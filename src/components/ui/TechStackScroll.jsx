// src/components/ui/TechStackScroll.jsx
import React from "react"
import { cn } from "../../lib/utils"

const TechStackScroll = ({ className = "" }) => {
  // Tech stack technologies
  const technologies = ["React 18", "Tailwind CSS", "Pollinations AI", "Framer Motion", "Vite 7", "Firebase"]

  return (
    <div className={cn("w-full max-w-4xl mx-auto py-4", className)}>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {technologies.map((tech, index) => (
          <span 
            key={tech}
            className="px-3 py-1 bg-slate-200/50 dark:bg-white/10 rounded-full text-slate-700 dark:text-white/70 font-semibold"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TechStackScroll
