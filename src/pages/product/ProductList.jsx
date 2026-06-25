import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
  import { Loader2,Plus } from "lucide-react";

import {
  getProducts,
  deleteProduct,
} from "../../features/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, loading } = useSelector(
    (state) => state.products
  );


  
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

// delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const result = await dispatch(
        deleteProduct(id)
      );

      if (
        deleteProduct.fulfilled.match(result)
      ) {
        toast.success("Product deleted successfully");
      } else {
        toast.error(
          result.payload || "Delete failed"
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

 
// edit
  const handleEdit = (id) => {
    navigate(`/edit-product/${id}`);
  };

// loading
   if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#12D6C3]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            All Products
          </h1>

          <button
            onClick={() =>
              navigate("/createProduct")
            }
            className="bg-[#12D6C3] text-white px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer"
          >
            + Add Product
          </button>
        </div>

      {/* if no product */}
        {products?.length === 0 ? (
          <div className="bg-white p-8 text-center rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700">
              No Products Found
            </h2>
            <p className="text-gray-500 mt-2">
              Please add some products first
            </p>
          </div>
        ) : (
         
          // product grid
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {products?.map((product) => (
    <div
      key={product._id}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* IMAGE WRAPPER */}
      <div className="w-full h-48 object-contain bg-white p-2">
        <img
          src={product.image}
          alt={product.productName}
          className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* NAME */}
        <h2 className="font-semibold text-gray-800 text-base line-clamp-1">
          {product.productName}
        </h2>

        {/* CODE + CATEGORY */}
        <p className="text-xs text-gray-500 mt-1">
          Code: {product.productCode}
        </p>
        <p className="text-xs text-gray-500">
          {product.category}
        </p>

        {/* PRICE SECTION */}
        <div className="mt-3 flex items-end gap-2">
          <p className="text-lg font-bold text-gray-900">
            ₹{product.sellingPrice}
          </p>

          <p className="text-sm text-gray-400 line-through">
            ₹{product.mrpPrice}
          </p>

          {/* DISCOUNT */}
          <span className="text-xs text-green-600 font-semibold">
            {Math.round(
              ((product.mrpPrice - product.sellingPrice) /
                product.mrpPrice) *
                100
            )}
            % off
          </span>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => handleEdit(product._id)}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Edit
          </button>

          <button
            onClick={() => handleDelete(product._id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl text-sm font-medium transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;