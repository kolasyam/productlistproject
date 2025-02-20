// // import React from "react";
// // import Product from "./products/page";
// // const page = () => {
// //   return (
// //     <div>
// //       <Product />
// //     </div>
// //   );
// // };

// // export default page;
// "use client";
// import { Plus, Loader2 } from "lucide-react";
// import { useEffect, useState } from "react";
// import { redirect } from "next/navigation";
// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   rating: number;
//   thumbnail: string;
//   category: string;
// }

// interface ApiResponse {
//   products: Product[];
//   total: number;
//   skip: number;
//   limit: number;
// }

// function App() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState("all");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await fetch("https://dummyjson.com/products");
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data: ApiResponse = await response.json();
//         setProducts(data.products);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const categories = [
//     "all",
//     ...new Set(products.map((product) => product.category)),
//   ];
//   const filteredProducts =
//     selectedCategory === "all"
//       ? products
//       : products.filter((product) => product.category === selectedCategory);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-black text-white flex items-center justify-center">
//         <div className="text-center px-4">
//           <p className="text-red-400 text-lg mb-4">Error: {error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white px-4 py-6 max-w-[430px] mx-auto">
//       <h1 className="text-3xl font-bold mb-4">Product List</h1>

//       {/* Category Filter */}
//       {/* <div className="flex gap-4 pb-4 overflow-x-auto">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-4 py-2 rounded-full text-sm font-semibold transition
//               ${selectedCategory === category
//                 ? 'bg-yellow-500 text-black'
//                 : 'text-gray-400'}`}
//           >
//             {category}
//           </button>
//         ))}
//       </div> */}
//       <div className="flex gap-2 px-4 overflow-x-auto pb-4 no-scrollbar">
//         {categories.map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category)}
//             className={`px-4 py-2 rounded-full whitespace-nowrap capitalize
//                 ${
//                   selectedCategory === category
//                     ? "bg-yellow-500 text-black font-semibold"
//                     : "bg-gray-800 text-gray-300"
//                 }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         {loading ? (
//           <div className="col-span-2 flex justify-center py-12">
//             <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
//           </div>
//         ) : (
//           filteredProducts.map((product) => (
//             <div
//               key={product.id}
//               onClick={() => redirect(`/product/${product.id}`)}
//               className="bg-gray-900 rounded-xl p-3 space-y-2 shadow-lg cursor-pointer"
//             >
//               <img
//                 src={product.thumbnail}
//                 alt={product.title}
//                 className="w-full h-[120px] object-cover rounded-lg"
//               />
//               <div className="flex items-center text-yellow-500 text-sm font-medium">
//                 ★ {product.rating}
//               </div>
//               <h3 className="text-sm font-semibold text-white truncate">
//                 {product.title}
//               </h3>
//               <p className="text-xs text-gray-400 truncate">
//                 {product.description}
//               </p>
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-bold text-white">
//                   ${product.price}
//                 </span>
//                 <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
//                   <Plus className="w-5 h-5 text-white" />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default App;
"use client";
import { create } from "zustand";
import { Plus, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedCategory: string;
  fetchProducts: () => void;
  setSelectedCategory: (category: string) => void;
}

const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: true,
  error: null,
  selectedCategory: "all",
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch("https://dummyjson.com/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      set({ products: data.products, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "An error occurred",
        loading: false,
      });
    }
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));

function App() {
  const {
    products,
    loading,
    error,
    selectedCategory,
    fetchProducts,
    setSelectedCategory,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories =
    products.length > 0
      ? ["all", ...new Set(products.map((product) => product.category))]
      : ["all"];
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-red-400 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-black rounded-full font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-[430px] mx-auto">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>

      <div className="flex gap-2 px-4 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap capitalize ${
              selectedCategory === category
                ? "bg-yellow-500 text-black font-semibold"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => redirect(`/product/${product.id}`)}
              className="bg-gray-900 rounded-xl p-3 space-y-2 shadow-lg cursor-pointer"
            >
              <Image
                width={315}
                height={250}
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-[120px] object-cover rounded-lg"
              />
              <div className="flex items-center text-yellow-500 text-sm font-medium">
                ★ {product.rating}
              </div>
              <h3 className="text-sm font-semibold text-white truncate">
                {product.title}
              </h3>
              <p className="text-xs text-gray-400 truncate">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-white">
                  ${product.price}
                </span>
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition">
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
