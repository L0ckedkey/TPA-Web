import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { useEffect, useState } from 'react';


export default function AboutNewEgg(){

    const [lang, setNewLang] = useState('en')

    const handleLangChange = (langNew:any) => {
        setNewLang(langNew);
        console.log("change")
        console.log(lang)
    };



    if(lang == 'en'){
        return(
            <div>
                <Navbar onLangChange={handleLangChange}/>
                    <h2>For two decades, Newegg has been at the forefront of e-commerce.</h2>
                    <label>Founded in 2001, Newegg began selling PC components and helped popularize the PC-building movement, and in doing so, developed a cult following among PC and DIY enthusiasts. Since then, Newegg Inc. is the leading tech-focused e-retailer in North America, with a global reach in Europe, South America, Asia Pacific and the Middle East. Today, millions of customers turn to Newegg to shop for the latest PC components, consumer electronics, smart home and gaming products. Newegg is consistently ranked as one of the best online shopping destinations, and the company regularly earns industry-leading customer service ratings. Newegg is headquartered in City of Industry, California, with North American distribution facilities located throughout the United States and Canada.</label>
                <Footer/>
            </div>
        )
    }else{
        return(
            <div>
                <Navbar onLangChange={handleLangChange}/>
                    <h2>Selama dua dekade, Newegg telah berada di garis depan e-commerce.</h2>
                    <label>Didirikan pada tahun 2001, Newegg mulai menjual komponen PC dan membantu mempopulerkan gerakan pembuatan PC, dan dengan melakukan itu, mengembangkan kultus di kalangan penggemar PC dan DIY. Sejak saat itu, Newegg Inc. menjadi peritel elektronik terkemuka yang berfokus pada teknologi di Amerika Utara, dengan jangkauan global di Eropa, Amerika Selatan, Asia Pasifik, dan Timur Tengah. Saat ini, jutaan pelanggan beralih ke Newegg untuk berbelanja komponen PC terbaru, elektronik konsumen, rumah pintar, dan produk game. Newegg secara konsisten mendapat peringkat sebagai salah satu tujuan belanja online terbaik, dan perusahaan secara teratur mendapatkan peringkat layanan pelanggan terdepan di industri. Newegg berkantor pusat di City of Industry, California, dengan fasilitas distribusi Amerika Utara yang berlokasi di seluruh Amerika Serikat dan Kanada.</label>
                <Footer/>
            </div>
        )
    }
   
}