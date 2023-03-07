import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import handleFileUpload from "@/utiil/firebase";
import { getShopID } from "@/utiil/token";
import axios from "axios";
import { useEffect, useState } from "react";
import style from '../../../styles/shops.module.css'

const addLink = 'http://localhost:8080/addBannerFromAdmin';
const getLink = 'http://localhost:8080/getBannerFromAdmin';
const updateLink = 'http://localhost:8080/updateBannerFromAdmin';
const deleteLink = 'http://localhost:8080/deleteBannerFromAdmin'

export default function(){
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        axios.get(getLink).then(function (response) {
            console.log(response.data);
            setLinks(response.data);
            setIsLoading(false);
        })
        .catch(function (error) {
            console.log(error);
        });
        
    },[]);

    useEffect(() => {
        console.log("links");
        // console.log(links.length);
        console.log(links);
    }, [links]);

    async function handleFileChange(event:any) {
        setIsLoading(true)
        const file = event.target.files[0];
        var files = await handleFileUpload(file);
        console.log(files);
        axios.get(addLink,{
            params:{
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
        axios.get(getLink).then(function (response) {
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

    async function deleteImageLinks(bannerID:any){
        axios.get(deleteLink,{
            params:{
                ID:bannerID,
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
            {Array.isArray(links) && links.length > 0 ? (
                <div className={style["img-banner-container"]}>
                {links.map((link: any) => {
                    console.log(link);
                    return (
                        <div key={link.ID}> {/* added key prop */}
                        <img src={link.Url} alt={"eror"} className={style["img-banner"]}/>
                        <input type="file" onChange={(e) => updateImageLinks(link.ID, e)}  />
                        <button onClick={() => deleteImageLinks(link.ID)}>Delete</button>
                        </div>
                    );
                })}
                </div >
            ) : (
                <p>No banners found.</p>
            )}
           
            <Footer/>
        </div>
    );
}
