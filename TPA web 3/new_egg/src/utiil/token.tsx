import { Cookie } from '@next/font/google';
import Axios from 'axios'
import { NextRouter } from 'next/router'

function getCookie(){
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('Token'))
        ?.split('=')[1];

    return cookieValue
}

export async function getName(){
    var cookie = getCookie();

    if(cookie === undefined){
        console.log("here")
    }else{
        var link = "http://localhost:8080/getUserFromCookie"
        var name = ""
        const result = await Axios.get(link,{params:{token: cookie}})
    
        console.log(result.data)
    
        return result.data.Name
    }
    
}

export async function getNewsletterStatus(){
    var cookie = getCookie();

    if(cookie === undefined){

    }else{
        var link = "http://localhost:8080/getUserFromCookie"
        var name = ""
        const result = await Axios.get(link,{params:{token: cookie}})
    
        console.log(result.data)
    
        return result.data.NewsLetterStatus
    }
    
}

export async function getUserID(){
    var cookie = getCookie();
    if(cookie === undefined){
        return "No data"
    }else{
        var link = "http://localhost:8080/getUserFromCookie"
        var name = ""
        const result = await Axios.get(link,{params:{token: cookie}})
    
        // console.log(result.data)
    
        return result.data.ID
    }
    
}


export async function getRole(){
    var cookie = getCookie();
    
    if(cookie === undefined){
        console.log("here")
    }else{
        var link = "http://localhost:8080/getUserFromCookie"
        var name = ""
        const result = await Axios.get(link,{params:{token: cookie}})

        // console.log(result.data)

        return result.data.Role
    }
}


export async function getUser(){
    var link = "http://localhost:8080/getUserFromCookie"
    var cookie = getCookie();

    if(cookie === undefined){
        return "No data"
    }else{
        const result = await Axios.get(link,{params:{token: cookie}})
        console.log(result.data)
        return result.data
    }

   
}

export async function getShopID(){
    var cookie = getCookie();
    var link = "http://localhost:8080/getUserFromCookie"
    var name = ""
    const result = await Axios.get(link,{params:{token: cookie}})

    // console.log(result.data)

    return result.data.ShopID

}

export default function middleware(route:string, auth:any, router:NextRouter){
    var cookie = getCookie();
    console.log(route)
    // console.log("route " + route)
    var link = "http://localhost:8080/getUserFromCookie"
    // console.log("cookie " + cookie)
    if(cookie === undefined ){
        if(route === "/signIn" || route === "/signUp" || route === "/password"){
            router.push(route)
        }else{
            console.log("no cookie")
            router.push("/")
        }
        
    }else{
        if(route === "/signIn" || route === "/signUp" || route === "/password"){
            router.push("/home")
        }else{
            if(auth === ""){
                console.log("all can join")
                router.push(router)
            }else{
                Axios.get(link,{
                    params:{token: cookie}
                  })
                    .then(function (response) {
                        // console.log(response.data)
                        if(response.data.Role != auth){
                            console.log("yes")
                            router.push("/home")
                        }else{
                            console.log("no")
                        }
                    })
                    .catch(function (error) {
                    //   console.log(error);
                    })
                    .then(function () {
                      // always executed
                    });  
            }
        }
        
        
    }

}