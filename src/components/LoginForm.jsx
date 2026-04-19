import React, { useState } from 'react'
import SocialLogin from './SocialLogin'

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState('masuk')
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    rememberPassword: false,
    
    // Register fields
    nama: '',
    emailRegister: '',
    passwordRegister: '',
    noTelepon: '',
    alamat: ''
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    console.log('Login submitted:', {
      email: formData.email,
      password: formData.password,
      rememberPassword: formData.rememberPassword
    })
    alert('Login berhasil! Cek console untuk detail.')
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    console.log('Register submitted:', {
      nama: formData.nama,
      email: formData.emailRegister,
      password: formData.passwordRegister,
      noTelepon: formData.noTelepon,
      alamat: formData.alamat
    })
    alert('Pendaftaran berhasil! Cek console untuk detail.')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <h1 className="font-['Dancing_Script'] text-5xl md:text-6xl text-[#B8445E] mb-2">
        Selamat Datang
      </h1>
      <p className="text-[#DE8C9C] mb-8">
        {activeTab === 'masuk' 
          ? 'Silakan masuk ke akun Anda' 
          : 'Buat akun baru untuk bergabung'}
      </p>

      {/* Tab Switch */}
      <div className="flex bg-white p-1 rounded-full mb-8 shadow-soft">
        <button
          className={`flex-1 py-3 px-6 rounded-full text-center transition-all duration-300 ${
            activeTab === 'masuk' 
              ? 'bg-[#B8445E] text-white shadow-button' 
              : 'text-[#E47990] hover:text-[#B8445E]'
          }`}
          onClick={() => setActiveTab('masuk')}
        >
          Masuk
        </button>
        <button
          className={`flex-1 py-3 px-6 rounded-full text-center transition-all duration-300 ${
            activeTab === 'daftar' 
              ? 'bg-[#B8445E] text-white shadow-button' 
              : 'text-[#E47990] hover:text-[#B8445E]'
          }`}
          onClick={() => setActiveTab('daftar')}
        >
          Daftar
        </button>
      </div>

      {/* Conditional Form - Login or Register */}
      {activeTab === 'masuk' ? (
        /* Login Form */
        <form onSubmit={handleLoginSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* Remember Password Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberPassword"
              id="rememberPassword"
              checked={formData.rememberPassword}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#B8445E] rounded border-[#DE8C9C] focus:ring-[#E47990]"
            />
            <label htmlFor="rememberPassword" className="ml-2 text-[#E47990]">
              Simpan kata sandi
            </label>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm text-[#B8445E] hover:text-[#E47990] transition-colors">
              Lupa kata sandi?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B8445E] text-white font-semibold py-4 px-6 rounded-full shadow-button hover:bg-[#E47990] transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Masuk
          </button>
        </form>
      ) : (
        /* Register Form */
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <input
              type="text"
              name="nama"
              placeholder="Nama Lengkap"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="emailRegister"
              placeholder="Email"
              value={formData.emailRegister}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="passwordRegister"
              placeholder="Kata Sandi"
              value={formData.passwordRegister}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              minLength="6"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Konfirmasi Kata Sandi"
              onChange={(e) => {
                if (e.target.value !== formData.passwordRegister) {
                  e.target.setCustomValidity('Password tidak cocok!')
                } else {
                  e.target.setCustomValidity('')
                }
              }}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* No Telepon */}
          <div>
            <input
              type="tel"
              name="noTelepon"
              placeholder="No. Telepon"
              value={formData.noTelepon}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              pattern="[0-9]{10,13}"
              title="Masukkan nomor telepon yang valid (10-13 digit)"
            />
          </div>

          {/* Alamat */}
          <div>
            <textarea
              name="alamat"
              placeholder="Alamat Lengkap"
              value={formData.alamat}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all resize-none placeholder-[#E47990] text-[#B8445E]"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              className="w-5 h-5 mt-1 text-[#B8445E] rounded border-[#DE8C9C] focus:ring-[#E47990]"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-[#E47990]">
              Saya menyetujui <a href="#" className="text-[#B8445E] hover:text-[#E47990] transition-colors">Syarat dan Ketentuan</a> serta <a href="#" className="text-[#B8445E] hover:text-[#E47990] transition-colors">Kebijakan Privasi</a>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#B8445E] text-white font-semibold py-4 px-6 rounded-full shadow-button hover:bg-[#E47990] transition-all duration-300 transform hover:-translate-y-0.5 mt-6"
          >
            Daftar
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#DE8C9C]"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-[#FCC7D1] text-[#B8445E]">
            {activeTab === 'masuk' ? 'Masuk Cepat' : 'Atau daftar dengan'}
          </span>
        </div>
      </div>

      {/* Social Login */}
      <SocialLogin />
    </div>
  )
}

export default LoginForm