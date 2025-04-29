"use client"

import { useState } from "react"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")

  return (
    <div className="w-full flex -mx-[10%] px-8 py-8">
      {/* Left Side - Image */}
      <div className="w-1/2 flex justify-left items-center">
        <img
          src="https://res.cloudinary.com/dqhzef5yz/image/upload/v1739794286/Image_17-02-25_at_5.38_PM_g6s6pe.jpg"
          alt="Description"
          className="w-3/4 h-auto"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex justify-center items-center">
        {currentView === "sign-in" ? (
          <Login setCurrentView={setCurrentView} />
        ) : (
          <Register setCurrentView={setCurrentView} />
        )}
      </div>
    </div>
  )
}

export default LoginTemplate
