import Link from "next/link";

export default function Slide(){
    return (
        <div className="slide">
            <div className="slide-item">
                <Link href="/menu">
                <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/banner.jpg`} alt="Image 1" width={100 + "%"}></img>
                </Link>
            </div>
           
        </div>
    )
}