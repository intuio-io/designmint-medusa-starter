import React from "react"

const GradientBG = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.2)_0%,_rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(147,51,234,0.2)_0%,_rgba(0,0,0,0)_70%)]" />
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px] opacity-50" />
    </div>
  )
}

export default GradientBG
