// "use client";
// import React from "react";
// import { useParams } from "next/navigation";
// const page = () => {
//   const { id } = useParams();
//   return <div>{`Hello world${id}`}</div>;
// };

// export default page;
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Minus, Plus, ArrowLeft } from "lucide-react";
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
function ProductDetail() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="text-white text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      {/* <button
        onClick={() => redirect(`/`)}
        className="text-yellow-500 flex items-center gap-2 self-start"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button> */}

      {product && (
        <div className="w-full max-w-md mt-6 bg-gray-800 p-6 rounded-2xl text-center">
          <button
            onClick={() => redirect(`/`)}
            className="text-yellow-500 flex items-center gap-2 self-start"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <Image
            width={315}
            height={260}
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-64 object-cover rounded-xl"
          />
          <h2 className="text-2xl font-bold mt-4">{product.title}</h2>
          <div className="flex justify-center items-center gap-2 mt-2">
            <span className="text-yellow-500">★</span>
            <span className="text-lg text-gray-300">{product.rating}</span>
          </div>
          <p className="text-gray-400 mt-2">{product.description}</p>
          <span className="text-yellow-500 text-xl font-bold block mt-4">
            ${product.price}
          </span>

          <div className="flex items-center justify-center gap-6 mt-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-3 bg-gray-700 rounded-full"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-3 bg-gray-700 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button className="mt-6 px-6 py-3 w-full bg-yellow-500 text-black text-lg font-bold rounded-full">
            Add to cart
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
