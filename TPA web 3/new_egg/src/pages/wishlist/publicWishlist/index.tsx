import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { PublicCard } from "@/components/wishlistCard";
import { getUserID } from "@/utiil/token";
import Axios from "axios";
import { useEffect, useState } from "react"

export default function PublicWishlist(){

    const [wishlistHeader, setWishlistHeader] = useState([])
    const link = "http://localhost:8080/getAllPublicWishlist"
    const filteredLink = "http://localhost:8080/getWishlistHeaderFiltered"
    const getCountLink = "http://localhost:8080/getWishlistHeaderPublicCount"
    const [filterBy, setFilterBy] = useState('')
    const [pageLimit, setPageLimit] = useState(15)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [accountID, setAccountID] = useState('')


    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setAccountID(name)
        }
        
        getCurName()      
    }, [])

    useEffect(() => {
        Axios.get(getCountLink)
        .then(function (response) {
            var jsonArray = response.data
            setTotalPages(Math.ceil(jsonArray.length / pageLimit));
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    },[pageLimit])


    useEffect(() => {
        console.log(filterBy)
        Axios.get(filteredLink,{
            params:{
                filterBy: filterBy,
                limit: pageLimit,
                page: page,
                accountID: accountID
            }
        })
        .then(function (response) {
            console.log(response.data.WishlistHeader);

            setWishlistHeader(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    }, [filterBy, page, totalPages])

    useEffect(() => {
        // console.log(wishlistHeader.length);
        // console.log(filterBy);
        // console.log(pageLimit);
        // console.log(page);
        // console.log(totalPages);
    })


    const nextPage = () => {
        console.log(totalPages)
        if(page + 1 > totalPages){
            setPage(totalPages)
        }else{
            var pageNow = page+1
            console.log(pageNow)
            setPage(pageNow)
        }
       
    }

    const prevPage = () => {
        if(page - 1 <= 0){
            setPage(1)
        }else{
            var pageNow = page-1
            console.log(pageNow)
            setPage(pageNow)
        }
    }

    return(
        <div>
            <Navbar/>
            <select value={pageLimit} onChange={(event) =>setPageLimit(parseInt(event.target.value))}>
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={60}>60</option>
                    <option value={90}>90</option>
                </select>
            <select value={filterBy} onChange={(event) =>setFilterBy(event.target.value)}>
                    <option value={""}></option>
                    <option value={"Date ASC"}>Oldest to Newest</option>
                    <option value={"Date DESC"}>Newest to Oldest</option>
                    <option value={"Rating DESC"}>Lowest to Highest Rating</option>
                    <option value={"Rating ASC"}>Highest to Lowest Rating</option>
                    <option value={"Price DESC"}>Lowest to Highest Price</option>
                    <option value={"Price ASC"}>Highest to Lowest Price</option>
                    <option value={"Review DESC"}>Lowest to Highest Review</option>
                    <option value={"Review ASC"}>Highest to Lowest Review</option>
                    <option value={"Follower DESC"}>Lowest to Highest Follower</option>
                    <option value={"Follower ASC"}>Highest to Lowest Follower</option>
                    <option value={"Followed"}>Followed</option>
                </select>
            {
                wishlistHeader ?
                wishlistHeader.map((wishlistHeaderSingle:any) => {
                    
                    
                    if(filterBy == "Followed" && wishlistHeaderSingle.WishlistHeader != undefined){
                        console.log(wishlistHeaderSingle);
                        return(<PublicCard details={wishlistHeaderSingle.WishlistHeader}/>)
                    }else{
                        return(<PublicCard details={wishlistHeaderSingle}/>)
                    }
                    
                }):null
            }
            <button onClick={() => prevPage()}>prev</button>
            <button onClick={() => nextPage()}>next</button>
            <Footer/>
        </div>
    )
}