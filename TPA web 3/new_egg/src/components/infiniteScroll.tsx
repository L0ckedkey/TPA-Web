import  Axios  from "axios";
import { useState, useEffect, useRef } from "react";
import { Card, Cards } from "./card";

// const [search, setSearch] = useState('a')

// export function getSearch(search:any){
//   setSearch(search)
// }


export default function List(props:any) {
  const [products, setProducts] = useState([]);
  const link = "http://localhost:8080/getAllProducts"
  const linkFilterPrice = "http://localhost:8080/getAllProductsPrice"
  const linkFilterName = "http://localhost:8080/getProductsByName"
  const [max, setMax] = useState(5)
  const [triggered, setTriggered] = useState(1)

  // console.log(props.orderBy)
  console.log(props.search)
  function fetchItems() {
    Axios.get(link)
    .then(function (response) {
        setProducts(response.data)
        // console.log(response.data)
    })
    .catch(function (error) {
        // console.log(error);
    })
    .then(function () {
        // always executed
    }); 
  }


const sortProduct = () =>{
    Axios.get(linkFilterPrice,{
        params:{
            order:props.orderBy,
            name: props.search
        }
    })
    .then(function (response) {
      setProducts(response.data)
        // console.log(response.data)
    })
    .catch(function (error) {
      // console.log(error);
    })
    .then(function () {
      // always executed
    }); 
}

const getName = () =>{
  Axios.get(linkFilterName,{
    params:{
        name: props.search
    }
  })
  .then(function (response) {
    setProducts(response.data)
      // console.log(response.data)
  })
  .catch(function (error) {
    // console.log(error);
  })
  .then(function () {
    // always executed
  }); 
}

  function handleScroll() {
    if (
      scrollPos >= 1000 * triggered
    ) {
      var tempMax = max + 5;
      var trigger = triggered + triggered * 0.2;
      setTriggered(trigger)
      setMax(tempMax);
    }
  }

  useEffect(() => {
    // console.log(search)
    if(props.orderBy === "" && props.search === ""){
      console.log(1)
      fetchItems()
    }else if(props.orderBy !== ""){
      console.log(2)
      sortProduct()
    }else if(props.search !== ""){
      console.log(4)
      getName();
    }
  }, [props.orderBy, props.search])

  const [scrollPos, setScrollPos] = useState(0);

 useEffect(() => {
    function handleScroll() {
      setScrollPos(window.scrollY || document.documentElement.scrollTop);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // console.log(max)
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollPos]);

  return (

    <Cards>
      
        { products ? 
            products.slice(0,max).map((product:any) => {
                return(
                    <Card key={product.ID} details={product}></Card>
                ) 
            }) : console.log()
        }
        {/* <div>Scroll position: {scrollPos}px</div> */}
    </Cards>
   
  );
}


export function ListForBrand(props:any) {
  const [products, setProducts] = useState([]);
  const link = "http://localhost:8080/getAllProducts"
  const linkFilterPrice = "http://localhost:8080/getAllProductsPriceBrand"
  const linkFilterName = "http://localhost:8080/getProductsByBrand"

  // console.log(props.orderBy)
  // console.log(props.search)
  function fetchItems() {
    Axios.get(link)
    .then(function (response) {
        setProducts(response.data)
        // console.log(response.data)
    })
    .catch(function (error) {
        // console.log(error);
    })
    .then(function () {
        // always executed
    }); 
  }

  const sortProduct = () =>{
    Axios.get(linkFilterPrice,{
        params:{
          order:props.orderBy,
          name: props.search
        }
    })
    .then(function (response) {
        setProducts(response.data)
        // console.log(response.data)
    })
    .catch(function (error) {
      // console.log(error);
    })
    .then(function () {
      // always executed
    }); 
}

const getName = () =>{
  Axios.get(linkFilterName,{
    params:{
        name: props.search
    }
  })
  .then(function (response) {
    setProducts(response.data)
      // console.log(response.data)
  })
  .catch(function (error) {
    // console.log(error);
  })
  .then(function () {
    // always executed
  }); 
}

useEffect(() => {
  // console.log(search)
  if(props.orderBy === "" && props.search === ""){
    console.log(1)
    fetchItems()
  }else if(props.orderBy !== ""){
    console.log(2)
    sortProduct()
  }else if(props.search !== ""){
    console.log(4)
    getName();
  }
}, [props.orderBy, props.search])


  return (

    <Cards>
        { products ? 
            products.map((product:any) => {
                return(
                    <Card key={product.ID} details={product}></Card>
                ) 
            }) : console.log()
        }
    </Cards>
   
  );
}

