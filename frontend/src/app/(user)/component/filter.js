'use client'
import Link from 'next/link';
import React, { useState } from 'react';

export default function Filter() {
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(true);
    const [priceValue, setPriceValue] = useState(100000); 

    const togglePriceContent = () => {
        setIsPriceOpen(!isPriceOpen);
    };

    const toggleSizeContent = () => {
        setIsSizeOpen(!isSizeOpen);
    };

    const handlePriceSliderChange = (e) => {
        setPriceValue(e.target.value);
    };

    const handlePriceInputChange = (e) => {
        setPriceValue(e.target.value);
    };

    // Tạo dữ liệu kích thước từ 37 đến 43
    const sizes = [...Array(7).keys()].map(i => 37 + i);

    // Chia dữ liệu thành các hàng với mỗi hàng có 4 cột
    const rows = [];
    for (let i = 0; i < sizes.length; i += 4) {
        rows.push(sizes.slice(i, i + 4));
    }

    return (
        <>
            {/* Price */}
            <div className='fil-price p-2 border'>
                <div className="row">
                    <div className="col-12">
                        <div 
                            className="d-flex justify-content-between align-items-center p-2" 
                            style={{ cursor: "pointer" }} 
                            onClick={togglePriceContent}
                        >
                            <h5>Price</h5>
                            <span>{isPriceOpen ? '-' : '+'}</span>
                        </div>
                        {isPriceOpen && (
                            <div className="p-3 mt-1 mb-3">
                                <h6>Lọc Giá</h6>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100000" 
                                    value={priceValue} 
                                    onChange={handlePriceSliderChange} 
                                    className="form-range mb-2"
                                />
                                <div className="d-flex justify-content-between align-items-center">
                                    <input 
                                        type="number" 
                                        value={priceValue} 
                                        onChange={handlePriceInputChange}
                                        min="0"
                                        max="100000"
                                        className="form-control mr-2"
                                    />
                                    <output className="font-weight-bold">
                                        {Math.round(priceValue / 1000)}k
                                    </output>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Size */}
            <div className='fil-size p-2 border'>
                <div className="row">
                    <div className="col-12">
                        <div 
                            className="d-flex justify-content-between align-items-center p-2" 
                            style={{ cursor: "pointer" }} 
                            onClick={toggleSizeContent}
                        >
                            <h5>Size</h5>
                            <span>{isSizeOpen ? '-' : '+'}</span>
                        </div>
                        {isSizeOpen && (
                            <div className="p-3 mt-1 mb-3">
                                <h6>Lọc Kích Thước</h6>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                {row.map((size, idx) => (
                                                    <td key={idx}><Link href="#">{size}</Link></td>
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
        </>
    );
}
