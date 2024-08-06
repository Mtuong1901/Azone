'use client'
import Link from "next/link";
import Category from "./category";

export default function Trending(props){
    const cate = props.data;
    console.log(cate);
    return (
        <div className="container">
        <div className="tr-title">
        <h1>Trending Styles</h1>
        <Link href="#">Show all Trending Styles</Link>
        </div>
        <div className="tr-container">
        {cate.map((data) => (
                 <div key={data._id}>
                 <Category data={data}/>
               </div>
            ))}
        </div>
        </div>
    )
}