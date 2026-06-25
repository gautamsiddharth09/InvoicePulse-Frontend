import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct,getProductById, updateProduct } from "../../features/productSlice";
  import { toast } from "react-toastify";
  import { Loader2 } from "lucide-react";
  import { useParams, useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const dispatch = useDispatch();
 const navigate = useNavigate();
 const { id } = useParams();

const { product, loading } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    category: "",
    description: "",
    mrpPrice: "",
    sellingPrice: "",
    gst: "",
    image: null,
  });

  // handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle image
  const handleImage = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

    useEffect(() => {
    if (id) {
      dispatch(getProductById(id));
    }
  }, [id, dispatch]);

   useEffect(() => {
    if (id && product) {
      setFormData({
        productName: product.productName || "",
        productCode: product.productCode || "",
        category: product.category || "",
        description: product.description || "",
        mrpPrice: product.mrpPrice || "",
        sellingPrice: product.sellingPrice || "",
        gst: product.gst || "",
        image: null,
      });
    }
  }, [id, product]);

  // submit form
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("productName", formData.productName);
  data.append("productCode", formData.productCode);
  data.append("category", formData.category);
  data.append("description", formData.description);
  data.append("mrpPrice", formData.mrpPrice);
  data.append("sellingPrice", formData.sellingPrice);
  data.append("gst", formData.gst);
 
if (formData.image instanceof File) {
  data.append("image", formData.image);
}

  try {
      let resultAction;

  //  update mode
      if (id) {
        resultAction = await dispatch(
          updateProduct({ id, formData: data })
        );

        if (
          updateProduct.fulfilled.match(resultAction)
        ) {
          toast.success("Product updated successfully");
          navigate("/productList");
        } else {
          toast.error(
            resultAction.payload || "Update failed"
          );
        }
      }

    //  create mode
      else {
        resultAction = await dispatch(
          createProduct(data)
        );

        if (
          createProduct.fulfilled.match(resultAction)
        ) {
          toast.success("Product created successfully");

          setFormData({
            productName: "",
            productCode: "",
            category: "",
            description: "",
            mrpPrice: "",
            sellingPrice: "",
            gst: "",
            image: null,
          });
        } else {
          toast.error(
            resultAction.payload || "Create failed"
          );
        }
         navigate("/productList");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

// loading
  if (loading && id ) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#12D6C3]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-slate-600 mb-6">
          Create Product
        </h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-gray-900 mb-2">Product Name</label>
            <input
              name="productName"
              placeholder="Product Name"
              value={formData.productName}
              onChange={handleChange}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>
          {/* Product Code */}
          <div>
            <label className="block text-gray-900 mb-2">Product Code</label>
            <input
              name="productCode"
              placeholder="Product Code"
              value={formData.productCode}
              onChange={handleChange}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-gray-900 mb-2">Category</label>
            <input
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-900 mb-2">Description</label>
            <input
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>

          {/* Prices Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 mb-2">MRP Price</label>
              <input
                name="mrpPrice"
                type="number"
                placeholder="MRP Price"
                value={formData.mrpPrice}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Selling Price</label>
              <input
                name="sellingPrice"
                type="number"
                placeholder="Selling Price"
                value={formData.sellingPrice}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
              />
            </div>
          </div>

          {/* GST */}
          <div>
            <label className="block text-gray-900 mb-2">GST</label>
            <input
              name="gst"
              type="number"
              placeholder="GST %"
              value={formData.gst}
              onChange={handleChange}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-gray-900 mb-2">File</label>
            <input
              type="file"
              onChange={handleImage}
              className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
            />
          </div>
          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-[#12D6C3] cursor-pointer text-white font-semibold  hover:opacity-90"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
