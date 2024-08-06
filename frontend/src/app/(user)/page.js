'use client'
import Link from "next/link";
import Slide from "../../component/slide";
import Trending from "../../component/trending";
import useSWR from "swr";
const fetcher =  (...args) => fetch(...args).then((res) => res.json());

export default function Home(){
  const { data: trending, error: trendingerror } = useSWR(`${process.env.NEXT_PUBLIC_API}/products/category`, fetcher);
    if(!trending) return <div>Loading...</div>
    if(trendingerror) return <div>Error</div> 
  return (
    <div>
      <Slide/>
      <Trending data={trending}/>
     <Link href="/menu">
     <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/banner2.jpg`} alt="Image 1" width={100 + "%"}></img>
     </Link>
    </div>
  )
}