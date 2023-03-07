
import { useRouter } from 'next/router'
import style from '../../../styles/menus.module.css'
import { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { getUserID } from '@/utiil/token'
import  Axios from 'axios'


export default function GetAllReview(){

    const getProductReviewLink = "http://localhost:8080/getProductRevieweFromUser"
    const getShopReviewLink = "http://localhost:8080/getShopRevieweFromUser"
    const [accountID, setAccountID] = useState('')
    const [productReview, setProductReviews] = useState([])
    const [shopReviews, setShopReviews] = useState([])

    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            // console.log("name navbar " + name)
          setAccountID(name)
        }
        
        getCurName()      
    }, [])

    useEffect(() => {
        if(accountID != ""){
            Axios.get(getProductReviewLink, {
                params:{
                    accountID: accountID
                }
            }).then(function (response) {
            //    setProducts(response.data)
               console.log(response.data)
               setProductReviews(response.data)
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
            // always executed
            }); 

            Axios.get(getShopReviewLink, {
                params:{
                    accountID: accountID
                }
            }).then(function (response) {
            //    setProducts(response.data)
               console.log(response.data)
               setShopReviews(response.data)
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
            // always executed
            }); 
        }

    }, [accountID])

    return(
    <div>
        <Navbar/>
            {
                shopReviews ? shopReviews.map((shopReview:any) => {
                    return(
                        <div>
                            <ShopReviewCard details={shopReview}/>
                        </div>
                    )
                }):<h3>No review to shop</h3>
            }
             {
                productReview ? productReview.map((productReview:any) => {
                    return(
                        <div>
                            <ProductReviewCard details={productReview}/>
                        </div>
                    )
                }):<h3>No review to product</h3>
            }
        <Footer/>
    </div>)
}

function ShopReviewCard(props:any){

    props = props.details
    // console.log(props.ID);
    
    const deleteReviewLink = "http://localhost:8080/deleteShopReview"
    const updateReviewLink = "http://localhost:8080/updateShopReview"
    const [updateReview, setUpdateReview] = useState(false)
    const [point, setPoint] = useState(0)
    const [review, setReview] = useState('')
    const [question1, setQuestion1] = useState(-1)
    const [question2, setQuestion2] = useState(-1)
    const [question3, setQuestion3] = useState(-1)

    const UpdateReview = () => {
        Axios.get(updateReviewLink, {
            params:{
                reviewID: props.ID,
                newQ1: question1,
                newQ2: question2,
                newQ3: question3,
                shopPoint: point,
                review: review
            }
        }).then(function (response) {
        //    setProducts(response.data)
           console.log(response.data)
        //    window.location.reload()
        //    setShopReviews(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        }); 
    }
    
    const UpdateReviewForm = () => {
        const inputRef = useRef(null);
        useEffect(() => {
            inputRef.current.focus(); // set the focus on the input field when the component mounts
          }, []);

        return(
            <div className={style["question-container"]}>
            <div className={style["question"]}>
                <label>Item Delivered On Time : </label>
                <select value={question1} onChange={(event) =>setQuestion1(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Item as seller described : </label>
                <select value={question2} onChange={(event) =>setQuestion2(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Satisfactory Customer Service : </label>
                <select value={question3} onChange={(event) =>setQuestion3(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>Yes</option>
                    <option value={0}>No</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Overall Shop Performance : </label>
                <select value={point} onChange={(event) =>setPoint(parseInt(event.target.value))} className={style["add-product-input-dropdown"]}>
                    <option value={-1}></option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
            </div>
            <div className={style["question"]}>
                <label>Review : </label>
                <input value={review} onChange={(e) => setReview(e.target.value)} ref={inputRef}></input>
            </div>
            <button onClick={() => UpdateReview()}>Update</button>
        </div>
        )
    }

    useEffect(() => {
        console.log(review);
        
    })

    const deleteReview = () => {
        Axios.get(deleteReviewLink, {
            params:{
                reviewID: props.ID
            }
        }).then(function (response) {
        //    setProducts(response.data)
           console.log(response.data)
           window.location.reload()
        //    setShopReviews(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        }); 
    }

    const setUpdate = () => {
        // console.log(updateReview);
        
        if(updateReview){
            setUpdateReview(false)
        }else{
            setUpdateReview(true)
        }
    }

    return(
        <div>
            <h4>Review ID : {props.ID}</h4>
            <h4>Order ID : {props.OrderHeaderID}</h4>
            <h4>Shop ID : {props.ShopID}</h4>
            <h4>Question 1 : {props.PointQuestion1}</h4>
            <h4>Question 2 : {props.PointQuestion2}</h4>
            <h4>Question 3 : {props.PointQuestion3}</h4>
            <h4>Shop Point : {props.ShopPoint}</h4>
            <h4>Review : {props.Review}</h4>
            <button onClick={() => deleteReview()}>Delete</button>
            <button onClick={() => setUpdate()}>Update Review</button>
            {
                updateReview ?
                <UpdateReviewForm/>:null
            }
        </div>
    )
}

function ProductReviewCard(props:any){

    props = props.details
    const deleteReviewLink = "http://localhost:8080/deleteProductReview"

    const deleteReview = () => {
        Axios.get(deleteReviewLink, {
            params:{
                reviewID: props.ID
            }
        }).then(function (response) {
        //    setProducts(response.data)
           console.log(response.data)
           window.location.reload()
        //    setShopReviews(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        }); 
    }


    return(
        <div>
            <h4>Order ID : {props.OrderHeaderID}</h4>
            <h4>Point : {props.Point}</h4>
            <h4>Review : {props.Review}</h4>
            <button onClick={() => deleteReview()}>Delete</button>
        </div>
    )
}