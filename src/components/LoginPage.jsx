import React from 'react'
import LoginForm from './LoginForm'

const LoginPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F8D8DE]">
      {/* Left Section - Form */}
      <div className="bg-[#FCC7D1] p-8 md:p-16 lg:p-20 flex items-center justify-center">
        <LoginForm />
      </div>

      {/* Right Section - Illustration */}
      <div className="bg-[#F0B3C5] hidden md:flex items-center justify-center p-8">
        <div className="max-w-[450px] lg:max-w-[550px] w-full">
          <img 
            src="/src/assets/images/image-login.png"
            alt="Chef cooking illustration"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default LoginPage