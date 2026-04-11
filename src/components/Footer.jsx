import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#DE8C9C] py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h3 className="font-['Dancing_Script'] text-2xl text-[#B8445E]">Mama Pasha's Treats</h3>
            <p className="text-sm text-[#E47990] mt-1">Snack & Catering Profesional</p>
          </div>
          <div className="flex gap-6 text-sm text-[#E47990]">
            <a href="#" className="hover:text-[#B8445E] transition">Tentang Kami</a>
            <a href="#" className="hover:text-[#B8445E] transition">Kebijakan Privasi</a>
            <a href="#" className="hover:text-[#B8445E] transition">Kontak</a>
          </div>
          <div className="text-sm text-[#DE8C9C]">
            &copy; {new Date().getFullYear()} Mama Pasha's Treats
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
