"use client";
import Left from "@/component/left";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Add() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/addCategory`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Có lỗi xảy ra khi thêm danh mục");
      }

      const result = await res.json();
      router.push("/admin/category");
      console.log("Category added:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="container-fluid overflow-hidden">
      <div className="row vh-100 overflow-auto">
        <Left />
        <div className="col d-flex flex-column h-sm-100">
          <main className="row overflow-auto">
            <div className="col">
              <div className="p-3 bg-light text-dark">
                <h1 align="center" className="fs-1">
                  Category
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label>Tên danh mục</label>
                    <input
                      type="text"
                      placeholder="tên danh mục"
                      {...register("name", { required: true })}
                      className="form-control"
                    />
                    {errors.name && <p>Tên danh mục là bắt buộc</p>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="productImage">Hình Ảnh Danh mục</label>
                    <input
                      type="file"
                      className="form-control"
                      {...register("image")}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
