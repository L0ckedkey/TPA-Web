import  Axios  from "axios";
import { useState, useEffect, useRef } from "react";
import { Card, Cards } from "./card";

export default function List() {
  const [products, setProducts] = useState([]);
  const link = "http://localhost:8080/getAllProducts"
  const [max, setMax] = useState(5)
  function fetchItems() {
    Axios.get(link)
    .then(function (response) {
        setProducts(response.data)
        console.log(response.data)
    })
    .catch(function (error) {
        console.log(error);
    })
    .then(function () {
        // always executed
    }); 
  }

  function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      var tempMax = max + 5;

      setMax(tempMax);
    }
  }

  useEffect(() => {
    fetchItems();
    console.log(max)
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [max]);

  return (

           <Cards>
                { products ? 
                    products.slice(0,max).map((product:any) => {
                        return(
                            <Card key={product.ID} details={product}></Card>
                        ) 
                    }) : console.log('not yet')
                }
            </Cards>
   
  );
}
