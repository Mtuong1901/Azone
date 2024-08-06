"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";


const fetcher = (...args) => fetch(...args).then((res) => res.json());

const ProductForm = ({ categories, product, onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      price: product?.price || "",
      description: product?.description || "",
      categoryId: product?.categoryId || "",
    },
  });

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
      setValue("categoryId", product.categoryId);
    }
  }, [product, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">
          {product ? "Edit Product" : "Add Product"}
        </h1>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <div className="container">
          <div className="form-group">
            <label htmlFor="productName">Tên Sản Phẩm</label>
            <input
              type="text"
              className="form-control"
              {...register("name", { required: "Tên sản phẩm là bắt buộc" })}
            />
            {errors.name && <div className="text-danger">{errors.name.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="productCategory">Danh Mục</label>
            <select
              className="form-control"
              {...register("categoryId", { required: "Chọn một danh mục" })}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <div className="text-danger">{errors.categoryId.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Giá</label>
            <input
              type="number"
              className="form-control"
              {...register("price", { required: "Giá là bắt buộc", valueAsNumber: true })}
            />
            {errors.price && <div className="text-danger">{errors.price.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Mô Tả</label>
            <textarea
              className="form-control"
              {...register("description", { required: "Mô tả là bắt buộc" })}
            />
            {errors.description && <div className="text-danger">{errors.description.message}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="productImage">Hình Ảnh Sản Phẩm</label>
            {product && (
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
                alt="Product"
                className="img-fluid mb-2"
              />
            )}
            <input type="file" className="form-control" {...register("image")} />
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {product ? "Edit" : "Thêm"}
        </button>
      </div>
    </form>
  );
};

export default function Products() {
  const router = useRouter();
  const { data: products, error } = useSWR(`${process.env.NEXT_PUBLIC_API}/products`, fetcher);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/category`);
      const data = await res.json();
      setCategories(data);
    };
    getCategories();
  }, []);

  const handleAddProduct = async (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("price", parseFloat(values.price) || 0);
    data.append("description", values.description);
    data.append("categoryId", values.categoryId);
    if (values.image[0]) {
      data.append("image", values.image[0]);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/addproduct`, {
      method: "POST",
      body: data,
    });
    const result = await res.json();
    if (result.error) {
      console.error(result.error);
    } else {
      window.location.reload();
    }
  };

  const handleEditProduct = async (values, id) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("price", parseFloat(values.price) || 0);
    data.append("description", values.description);
    data.append("categoryId", values.categoryId);
    if (values.image[0]) {
      data.append("image", values.image[0]);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/updateproduct/${id}`, {
      method: "PUT",
      body: data,
    });
    const result = await res.json();
    if (result.error) {
      console.error(result.error);
    } else {
      window.location.reload();
    }
  };

  const deleteProduct = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/deleteproduct/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.message) {
        alert(result.message);
        window.location.reload();
      }
    }
  };

  const editProduct = async (id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`);
    const data = await res.json();
    setProduct(data);
    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
  };

  if (!products) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <Link href="/admin">Back</Link>
      <h1 align="center">Products</h1>
      <div className="row">
        <div className="col-lg-4">
          <div className="box-card" style={{ backgroundColor: "rgb(255, 204, 204)", width: "100%", height: "100%" }}>
            <div className="card-body">
              <i className="fa-solid fa-box fs-1" style={{ color: "red" }}></i>
              <h2 className="card-title p-2">{products.length}</h2>
              <h3 className="card-text">Products</h3>
              <p className="text-primary">Last day +8%</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="box-card" style={{ backgroundColor: "rgb(204, 255, 204)", width: "100%", height: "100%" }}>
            <div className="card-body">
              <i className="fa-solid fa-bookmark fs-1" style={{ color: "green" }}></i>
              <h2 className="card-title p-2">4</h2>
              <h3 className="card-text">Category</h3>
              <p className="text-primary">Last day +8%</p>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="box-card" style={{ backgroundColor: "rgb(204, 229, 255)", width: "100%", height: "100%" }}>
            <div className="card-body">
              <i className="fa-solid fa-bookmark fs-1" style={{ color: "blue" }}></i>
              <h2 className="card-title p-2">4</h2>
              <h3 className="card-text">Order</h3>
              <p className="text-primary">Last day +8%</p>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between mt-4">
        <div className="col-lg-4">
          <input className="form-control" placeholder="Search" />
        </div>
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addProductModal"
        >
          Add Product
        </button>
      </div>
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Hình Ảnh</th>
                  <th>Mô Tả</th>
                  <th>Danh Mục</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id}</td>
                    <td>{product.name}</td>
                    <td>{parseFloat(product.price).toLocaleString('vi-VN')} VND</td>

                    <td>
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`}
                        alt="Product"
                        style={{ width: "50px", height: "50px" }}
                      />
                    </td>
                    <td>{product.description}</td>
                    <td>{product.category}</td>
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => editProduct(product._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="addProductModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <ProductForm categories={categories} onSubmit={handleAddProduct} />
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="editProductModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <ProductForm categories={categories} product={product} onSubmit={(values) => handleEditProduct(values, product._id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
