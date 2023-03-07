import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Card, Cards } from "@/components/userCard";
import middleware from "@/utiil/token";
import  Axios  from "axios";
import { useRouter } from "next/router";
import { endianness } from "os";
import { useEffect, useState } from "react";

export default function ShowUser(){
    const link = "http://localhost:8080/getAllUsers"
    const [filterBy, setFilterBy] = useState('')
    const [accounts, setAccounts] = useState([])
    var router = useRouter()
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const [maxPage, setMaxPage] = useState(0)
    
    const handlePrevPage = () => {
      setCurrentPage(currentPage - 1);
    };
  
    const handleNextPage = () => {
      setCurrentPage(currentPage + 1);
    };

    useEffect(() => {
        Axios.get(link,{
            params:{
                filter: filterBy
            }
        })
        .then(function (response) {
            // console.log(response.data)
            setAccounts(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
        .then(function () {
        // always executed
        });  
    
        middleware('admin/showUser','Admin', router)
    }, [filterBy])


    useEffect(() => {
        setCurrentPage(1)
        // console.log("Length")
        // console.log(accounts.length)
        if(accounts !== null){
            if(accounts.length !== 0){
                setMaxPage(Math.floor(accounts.length / 10)+1)
            }
        }else{
            setMaxPage(1)
        }
     
    },[accounts])
    return(
        
        <div>
            <Navbar/>
                <select value={filterBy} onChange={(event) => setFilterBy(event.target.value)}>
                    <option value={""}></option>
                    <option value={"Banned"}>Banned Only</option>
                    <option value={"Active"}>Active Only</option>
                </select>
                <Cards>
                    {
                        accounts ? 
                        accounts.slice(startIndex, endIndex).map((account:any) => {
                            return(
                                <Card key={account.ID} details={account}></Card>
                            )
                        }):
                        console.log("not yet")
                    }
                </Cards>

                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Prev
                </button>
                <button onClick={handleNextPage} disabled={currentPage === maxPage}>
                    Next
                </button>
            <Footer/>
        </div>
    )
}