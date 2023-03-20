import Axios from "axios";
import { useEffect, useState } from "react"

export default function ViewShop(props:any){
    var shops = props.details
    
    return(
        <div>
           {
            shops ? shops.map((shop:any) => {
                return(
                    <div>
                        <h3>{shop.Name}</h3>
                        <h3>{shop.Status}</h3>
                    </div>
                )
            }):null
           }
        </div>
    )


}