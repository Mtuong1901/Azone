'use client'
import React, { useEffect, useState } from 'react';
import ProductList from '../../component/productList';

export default function Search(params) {
    const [productSearch, setProductSearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/search/` + params.searchParams.keyword);
                if (!response.ok) {
                    throw new Error('Lỗi khi tìm kiếm sản phẩm');
                }
                const data = await response.json();
                setProductSearch(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.keyword]);

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    console.log(productSearch);
    return (
        <div className="container mt-3">
            <div className="row d-flex">
                <div className="col-12">
                    <h3>Kết quả tìm kiếm cho từ khóa: {params.keyword}</h3>
                    
                </div>
                <div className="col-12">
                        <ProductList data={productSearch} />
                    </div>
            </div>
        </div>
    );
}
