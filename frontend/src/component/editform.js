import { useForm } from 'react-hook-form';

const ProductEditForm = ({ onSubmit, categories, product }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      description: product.description,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="exampleModalLabel">
          Form edit
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
              {...register('name', { required: 'Tên sản phẩm là bắt buộc' })}
            />
            {errors.name && (
              <div className="text-danger">{errors.name.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="productCategory">Danh Mục</label>
            <select
              className="form-control"
              {...register('categoryId', { required: 'Chọn một danh mục' })}
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <div className="text-danger">{errors.categoryId.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="productPrice">Giá</label>
            <input
              type="number"
              className="form-control"
              {...register('price', { required: 'Giá là bắt buộc', valueAsNumber: true })}
            />
            {errors.price && (
              <div className="text-danger">{errors.price.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="productDescription">Mô Tả</label>
            <textarea
              className="form-control"
              {...register('description', { required: 'Mô tả là bắt buộc' })}
            />
            {errors.description && (
              <div className="text-danger">{errors.description.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="productImage">Hình Ảnh Sản Phẩm</label>
            <img
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product?.image}`}
              alt="Product"
              className="img-fluid mb-2"
            />
            <input type="file" className="form-control" {...register('image')} />
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
          Edit
        </button>
      </div>
    </form>
  );
};

export default ProductEditForm;
