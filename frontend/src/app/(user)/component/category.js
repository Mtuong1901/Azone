import Link from "next/link";

export default function Category(props){
    const category = props.data;
    return (
       <>
       <div className="tr-box">
        <Link href="#"><img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${category.image}`}></img></Link>
        </div>
       </>
    )
}