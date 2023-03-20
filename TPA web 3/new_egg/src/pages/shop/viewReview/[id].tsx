import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import ReviewCard from "@/components/reviewCard"
import  Axios  from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function ViewReview(){
    const router = useRouter()
    const { id } = router.query
    const getLink = 'http://localhost:8080/getShopReviewes'
    const [reviews, setReviews] = useState([])
    const [shop,setShop] = useState([] as any)
    const [search, setSearch] = useState('')
    const getReviewFilterTime = "http://localhost:8080/getShopReviewesFilterByTime" 
    const [filterBy, setFilterBy] = useState('')


    useEffect(() => {
        console.log(search)
            Axios.get(getReviewFilterTime,{
                params:{
                    shopID: id,
                    filterBy: filterBy,
                    search: search
                }
            }).then(function (response) {
                console.log(response.data)
                
                setReviews(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 
    }, [filterBy, search])


    useEffect(() => {
        console.log(id)
        if(id !=""){
            Axios.get(getLink,{
                params:{
                    shopID: id
                }
            })
            .then(function (response) {
                console.log(response.data)
                setShop(response.data[0].Shop)
                if(response.data != "Error"){
                    setReviews(response.data)
                }
                
            })
            .catch(function (error) {
              console.log(error);
            })
            .then(function () {
              // always executed
            }); 
    
        }
 
    }, [id])


    return(
        <div>
            <Navbar/>
                {
                    shop ? 
                    <div>
                        <h3>Shop Rating : {shop.RatingShop}</h3>
                        <h3>Reviewed : {shop.Reviewed}</h3>
                        <h3>Rating Question 1 : {shop.PointQuestion1 / shop.Reviewed}</h3>
                        <h3>Rating Question 2 : {shop.PointQuestion2 / shop.Reviewed}</h3>
                        <h3>Rating Question 3 : {shop.PointQuestion3 / shop.Reviewed}</h3>
                        <h3>Statistic Question 1 : {shop.PointQuestion1} / {shop.Reviewed}</h3>
                        <h3>Statistic Question 2 : {shop.PointQuestion2} / {shop.Reviewed}</h3>
                        <h3>Statistic Question 3 : {shop.PointQuestion3} / {shop.Reviewed}</h3>
                    </div>:null
                }
                <input onChange={(e) => setSearch(e.target.value)}></input>
                <select value={filterBy} onChange={(event) =>setFilterBy(event.target.value)}>
                    <option value={""}></option>
                    <option value={"Time ASC"}>Oldest to Newest</option>
                    <option value={"Time DESC"}>Newest to Oldest</option>
                    <option value={"Week Ago"}>Week Ago</option>
                </select>
                {
                    reviews ? reviews.map((review:any) => {
                        return(<ReviewCard details={review} key={review.ID}/>)
                    }): null
                }
            <Footer/>
        </div>
    )
}