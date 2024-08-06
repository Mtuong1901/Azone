'use client';
import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { addItem } from "@/redux/slices/cartSlices";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Detail({ params }) {
    const { data: product, error: productError } = useSWR(`${process.env.NEXT_PUBLIC_API}/products/${params.id}`, fetcher);
    const [isSizeOpen, setIsSizeOpen] = useState(true);
    const [quantity, setQuantity] = useState(1); // Khởi tạo số lượng mặc định là 1
    const [selectedSize, setSelectedSize] = useState(null); // Thêm state để theo dõi kích thước được chọn
    const [error, setError] = useState(null); // Thêm state để theo dõi lỗi
    const dispatch = useDispatch();

    const rows = [
        ["S", "M", "L"],
        ["XL", "XXL", "XXXL"]
    ];

    const toggleSizeContent = () => {
        setIsSizeOpen(!isSizeOpen);
    };

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1); // Không cho số lượng nhỏ hơn 1

    const handleSizeClick = (size) => {
        setSelectedSize(size); // Cập nhật kích thước được chọn
        setError(null); // Xóa lỗi khi kích thước được chọn
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setError("Vui lòng chọn kích thước.");
            return;
        }
        dispatch(addItem({product, quantity, size: selectedSize }));
    };

    if (productError) return <div>Lỗi khi tải chi tiết sản phẩm</div>;
    if (!product) return <div>Đang tải...</div>;

    return (
       <>
        <Link href="/menu" className="btn btn-secondary mb-3">Quay lại</Link>
        <div className="container">
            <div className="row">
                <div className="col-md-6">
                    <img className="img-fluid" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${product.image}`} alt={product.name} />
                    <div id="productCarousel" className="carousel slide mt-3" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {product.detail_image && product.detail_image.map((image, index) => (
                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}`} className="d-block w-100" alt={`Chi tiết ảnh ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon bg-secondary" aria-hidden="true"></span>
                            <span className="visually-hidden">Trước</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon bg-secondary" aria-hidden="true"></span>
                            <span className="visually-hidden">Tiếp theo</span>
                        </button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="detail">
                        <h1 className="product-name">{product.name}</h1>
                        <span className="product-price">{product.price.toLocaleString()} VND</span>
                        <p className="product-description">{product.description}</p>
                        <div className='fil-size p-2 border'>
                            <div className="row">
                                <div className="col-12">
                                    <div 
                                        className="d-flex justify-content-between align-items-center p-2" 
                                        style={{ cursor: "pointer" }} 
                                        onClick={toggleSizeContent}
                                    >
                                        <h5>Kích thước</h5>
                                        <span>{isSizeOpen ? '-' : '+'}</span>
                                    </div>
                                    {isSizeOpen && (
                                        <div className="p-3 mt-1 mb-3">
                                            <table className="table table-bordered">
                                                <tbody>
                                                    {rows.map((row, index) => (
                                                        <tr key={index}>
                                                            {row.map((size, idx) => (
                                                                <td key={idx} className="text-center">
                                                                    <button
                                                                        onClick={() => handleSizeClick(size)}
                                                                        className={`btn ${selectedSize === size ? 'btn-dark text-white' : 'btn-light'}`}
                                                                    >
                                                                        {size}
                                                                    </button>
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="pro-quantity d-flex justify-content-between align-items-center p-2">
                            <label className="me-2">Số lượng</label>
                            <div className="d-flex align-items-center p-3 mt-3 border">
                                <button onClick={decrementQuantity} className="btn btn-secondary">-</button>
                                <input type="text" value={quantity} readOnly className="form-control mx-2" />
                                <button onClick={incrementQuantity} className="btn btn-secondary">+</button>
                            </div>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <button className="btn btn-primary mt-3 w-100 p-3" onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
                    </div>
                </div>
            </div>
        </div>
       </>
    );
}
