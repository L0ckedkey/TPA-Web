import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import handleFileUpload from "@/utiil/firebase";
import { getShopID } from "@/utiil/token";
import axios from "axios";
import { useEffect, useState } from "react";
import style from '../../../styles/shops.module.css'

const addLink = 'http://localhost:8080/addBannerFromShop';
const getLink = 'http://localhost:8080/getBannerFromShop';
const updateLink = 'http://localhost:8080/updateBannerFromShop';
const deleteLink = 'http://localhost:8080/deleteBannerFromShop';

export default function(){
    const [shopID, setShopID] = useState('');
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const getCurName = async () => {
            var name = await getShopID();
            setShopID(name);
        };
        getCurName();     
    }, []);

    useEffect(() => {
        if(shopID != ""){
            axios.get(getLink,{
                params:{
                    shopID:shopID
                }
            }).then(function (response) {
                console.log(response.data);
                setLinks(response.data);
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    },[shopID]);

    // useEffect(() => {
    //     console.log("links");
    //     console.log(links.length);
    //     console.log(links);
    // }, [links]);

    async function handleFileChange(event:any) {
        setIsLoading(true)
        const file = event.target.files[0];
        var files = await handleFileUpload(file);
        console.log(files);
        axios.get(addLink,{
            params:{
                shopID:shopID,
                url: files
            }
        }).then(function (response) {
            console.log("Image uploaded successfully");
            fetchUpdatedLinks();
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    function fetchUpdatedLinks() {
        axios.get(getLink,{
            params:{
                shopID:shopID
            }
        }).then(function (response) {
            console.log(response.data);
            setLinks(response.data);
            setIsLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async function updateImageLinks(bannerID:any, event:any){
        const file = event.target.files[0];
        var files = await handleFileUpload(file);

        axios.get(updateLink,{
            params:{
                id:bannerID,
                url: files
            }
        }).then(function (response) {
            console.log(response.data);
            fetchUpdatedLinks(); // added this line to refresh the links after updating
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    async function DeleteImageLinks(bannerID:any){

        axios.get(deleteLink,{
            params:{
                id:bannerID,
            }
        }).then(function (response) {
            console.log(response.data);
            fetchUpdatedLinks(); // added this line to refresh the links after updating
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    return(
        <div>
            <Navbar/>
            <h1>Add Banner</h1>
            <input type="file" onChange={handleFileChange} />
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className={style["img-banner-container"]}>
                {links ? links.map((link: any) => {
                    console.log(link);
                    return (
                        <div key={link.ID}> {/* added key prop */}
                        <img src={link.Url} alt={"eror"} className={style["img-banner"]}/>
                        <input type="file" onChange={(e) => updateImageLinks(link.ID, e)}  />
                        <button onClick={() => DeleteImageLinks(link.ID)}>Delete</button>
                        </div>
                    );
                }) : null }
                </div >
            )}
           
            <Footer/>
        </div>
    );
}
