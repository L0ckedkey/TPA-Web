import AddToCartWishlist from "@/components/addToCart";
import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { ReviewWishlist } from "@/components/reviewCard";
import { getUserID } from "@/utiil/token";
import Axios from "axios";
import { useRouter } from "next/router"
import { useState, useEffect } from "react";
import { setCommentRange } from "typescript";

export default function GetDetail(){
    const router = useRouter()
    const {id} = router.query
    const [wishlistHeader, setWishlistHeader] = useState([] as any)
    const [wishlistDetail, setWishlistDetail] = useState([] as any)
    const wishlistHeaderLink = "http://localhost:8080/getWishlistHeader"
    const wishlistDetailLink = "http://localhost:8080/getWishlistDetail"
    const addCommentlLink = "http://localhost:8080/addComment"
    const getCommentlLink = "http://localhost:8080/getComments"
    const getReviewCountlLink = "http://localhost:8080/getReviewCount"
    

    const [comment, setNewComment] = useState('')
    const [point, setNewPoint] = useState(0)
    const [accountIDCookie, setAccountIDCookie] = useState('')
    const [reviews, setReviews] = useState([])
    const [accountID, setAccountID] = useState(0)
    const [reviewCount, setReviewCount] = useState([] as any)

    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setAccountIDCookie(name)
        }
        
        getCurName()      
    }, [])

    useEffect(() => {
        if(id != "" && id != undefined){
            Axios.get(wishlistHeaderLink,{
                params:{
                    ID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setWishlistHeader(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

            Axios.get(wishlistDetailLink,{
                params:{
                    ID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setWishlistDetail(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 


            Axios.get(getCommentlLink,{
                params:{
                    wishlistHeaderID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setReviews(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });

            Axios.get(getReviewCountlLink,{
                params:{
                    wishlistHeaderID: id
                }
            }).then(function (response) {
                // console.log(response.data)
                setReviewCount(response.data)
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            });
        }
    }, [id])

    useEffect(() => {
        console.log(wishlistDetail);
        
    },[wishlistDetail])

    const addComment = () => {
        Axios.get(addCommentlLink,{
                params:{
                    accountID: accountID,
                    wishlistHeaderID : id, 
                    review: comment,
                    point: point
                }
            }).then(function (response) {
                console.log(response.data)
                window.location.reload()
                // setWishlistHeader(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            }); 

    }

    const addToCart = (wishlistHeaderID: any) => {
        AddToCartWishlist(wishlistHeaderID)
        window.location.reload()
    }

    


    return(
        <div>
            <Navbar/>
                <h2>Name : {wishlistHeader.Name}</h2>
                <h2>Desc : {wishlistHeader.Description}</h2>
                <h2>Price : {wishlistHeader.Price}</h2>
                <h2>Total Reviews : {wishlistHeader.Reviews}</h2>
                <h2>Rating : {wishlistHeader.Rating}</h2>
                <h2>Point 0 : {reviewCount.Point0}</h2>
                <h2>Point 1 : {reviewCount.Point1}</h2>
                <h2>Point 2 : {reviewCount.Point2}</h2>
                <h2>Point 3 : {reviewCount.Point3}</h2>
                <h2>Point 4 : {reviewCount.Point4}</h2>
                <h2>Point 5 : {reviewCount.Point5}</h2>
                {
                    wishlistDetail ? 
                    wishlistDetail.map((wishlistDetailSingle:any) => {
                        return(<DetailCard details={wishlistDetailSingle} key={wishlistDetailSingle.ID}/>)
                    }): null
                }
                <input type={"text"} placeholder={"Comment"} onChange={(e) => setNewComment(e.target.value)}></input>
                <select value={point} onChange={(event) =>setNewPoint(parseInt(event.target.value))}>
                    <option value={0}></option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
                <select value={accountID} onChange={(event) =>setAccountID(parseInt(event.target.value))}>
                    <option value={accountIDCookie}>Self</option>
                    <option value={0}>Anonymus</option>
                </select>
                <button onClick={() => addComment()}>add comment</button>
                <button onClick={() => addToCart(wishlistHeader.ID)}>Add To Cart</button>
                {
                    reviews ?
                    reviews.map((review:any) => {
                        return(<ReviewWishlist details={review} key={review.ID}/>)
                    }): null
                }
            <Footer/>
        </div>
    )
}

function DetailCard(props:any){
    
    var props = props.details
    console.log(props)
    return(
        <div>
            <h2>{props.Product.ProductName}</h2>
            <img src={props.Product.Url}></img>
            <h3>{props.Product.ProductPrice}</h3>
        </div>
    )
}