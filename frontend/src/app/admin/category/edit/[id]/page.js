'use client'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function EditCategory({ params }) {
    const router = useRouter();
    const id = params.id;
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [category, setCategory] = useState(null);

    // Lấy danh mục theo ID từ backend
    useEffect(() => {
        const getCategory = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API}/products/category/${id}`);
                if (!res.ok) throw new Error('Failed to fetch category');
                const data = await res.json();
                setCategory(data);
                // Đặt giá trị ban đầu cho form
                setValue('name', data.name);
                setValue('image', data.image); // Nếu cần thiết, có thể xử lý hình ảnh
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        if (id) {
            getCategory();
        }
    }, [id, setValue]);

    
    useEffect(() => {
        if (category) {
            setValue('name', category.name);
            
        }
    }, [category, setValue]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image?.[0]) {
            formData.append("image", data.image[0]);
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products/updateCategory/${id}`,
                {
                    method: "PUT",
                    body: formData,
                }
            );
            const result = await res.json();
            if (res.ok) {
                alert("Danh mục đã được cập nhật thành công");
                router.push('/admin/category');
            } else {
                console.error(result.error);
                alert("Cập nhật danh mục không thành công: " + result.error);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            alert("Đã xảy ra lỗi khi cập nhật danh mục.");
        }
    };

    return (
        <div className="m-3">
            <h2>Chỉnh sửa Danh mục</h2>
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="form-group my-2">
                    <label className='form-label'>Tên danh mục</label>
                    <input
                        type="text"
                        className="form-control"
                        {...register('name', { required: 'Tên danh mục là bắt buộc' })}
                    />
                    {errors.name && <div className="text-danger">{errors.name.message}</div>}
                </div>
                
                <div className="form-group my-2">
                    <label className='form-label'>Hình ảnh (tuỳ chọn)</label>
                    <input
                        type="file"
                        className="form-control"
                        {...register('image')}
                    />
                </div>
                
                <button type="submit" className="btn btn-primary my-3">Cập nhật danh mục</button>
            </form>
        </div>
    );
}
