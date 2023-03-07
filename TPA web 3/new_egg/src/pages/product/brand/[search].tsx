import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import { useRouter } from 'next/router';
import Axios from 'axios'
import { useEffect, useState } from "react";
import List, { ListForBrand } from '@/components/infiniteScroll';

const link = "http://localhost:8080/getProductsByName"

export default function BrandHome(){
    const router = useRouter(); 
    const {search} = router.query;
    const [filterBy, setFilterBy] = useState('') 
    const [products, setNewProduct] = useState([])

    


    return(
        <div>
            <Navbar/>
            <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)}>
            <option value={""}></option>
                <option value={"price ASC"}>Price Lowest to Highest</option>
                <option value={"price DESC"}>Price Highest to Lowest</option>
                <option value={"rating ASC"}>Rating Lowest to Highest</option>
                <option value={"rating DESC"}>Rating Highest to Lowest</option>
                <option value={"reviews ASC"}>Reviews Lowest to Highest</option>
                <option value={"reviews DESC"}>Reviews Highest to Lowest</option>
                <option value={"sold ASC"}>Sold Lowest to Highest</option>
                <option value={"sold DESC"}>Sold Highest to Lowest</option>
            </select>
            <ListForBrand orderBy={filterBy} search={search} products={products}/>
            <Footer/>
        </div>
    )
}