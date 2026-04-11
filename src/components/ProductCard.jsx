// src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-md transition-all duration-300">
      <div className="aspect-square bg-[#F8D8DE] flex items-center justify-center">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-lg">{product.name}</h3>
        <p className="text-[#B8445E] font-bold mt-1">{formatPrice(product.price)}</p>
        <button className="mt-3 w-full bg-[#B8445E] text-white py-2 rounded-full text-sm hover:bg-[#E47990] transition-colors">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;