"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMax, setMin } from '@/redux/slices/filterSlice';

export default function Filter(props) {
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isSizeOpen, setIsSizeOpen] = useState(true);
    const dispatch = useDispatch();
    const minPrice = useSelector((state) => state.filter.min);
    const maxPrice = useSelector((state) => state.filter.max);

    const products = props.data || []; // Ensure data is defined

    const togglePriceContent = () => {
        setIsPriceOpen(!isPriceOpen);
    };

    const toggleSizeContent = () => {
        setIsSizeOpen(!isSizeOpen);
    };

    // Create size data from 37 to 43
    const sizes = [...Array(7).keys()].map(i => 37 + i);

    // Split data into rows with 4 columns each
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
                                    min={1000000} 
                                    max={3000000} 
                                    step={5000}
                                    value={minPrice}
                                    onChange={(e) => dispatch(setMin(e.target.value))} 
                                    className="form-range mb-2"
                                />
                                <input 
                                    type="range" 
                                    min={1000000} 
                                    max={3000000} 
                                    step={5000}
                                    value={maxPrice}
                                    onChange={(e) => dispatch(setMax(e.target.value))} 
                                    className="form-range mb-2"
                                />
                                <div className="d-flex justify-content-between align-items-center">
                                    <input 
                                        type="number" 
                                        min={1000000} 
                                        max={3000000} 
                                        step={5000}
                                        value={minPrice}
                                        onChange={(e) => dispatch(setMin(e.target.value))} 
                                        className="form-control mr-2"
                                    />
                                    <input 
                                        type="number" 
                                        min={1000000} 
                                        max={3000000} 
                                        step={5000}
                                        value={maxPrice}
                                        onChange={(e) => dispatch(setMax(e.target.value))} 
                                        className="form-control mr-2"
                                    />
                                    <output className="font-weight-bold">
                                        {Math.round(minPrice / 1000)}k - {Math.round(maxPrice / 1000)}k
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
                                            {/* Optionally add headers here */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows.map((row, index) => (
                                            <tr key={index}>
                                                {row.map((size, idx) => (
                                                    <td key={idx}>
                                                        <Link href="#">
                                                            {size} ({products.filter(product => product.size === size).length})
                                                        </Link>
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
        </>
    );
}
