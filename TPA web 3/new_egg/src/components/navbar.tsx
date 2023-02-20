import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import { ThemeContext } from './theme'
import bell from '../assets/bell.png'
import logo from '../assets/logo.png'
import style from '../styles/pages.module.css'
import { getName } from '@/utiil/token'
import { useRouter } from 'next/router'



export default function Navbar(){
    
    const {theme, setNewTheme} = useContext(ThemeContext)
    const [name, setName] = useState('')
    const router = useRouter()
    useEffect(() => {

        const getCurName = async () => {
            var name = await getName()
            console.log("name navbar " + name)
            if(name == null){
                setName("Sign In / Register")
            }else{
                setName(name)
            }
        }
        
        getCurName()

        
        
    }, [])

    const goToUserDetail = () => {
        router.push("/user")
    }

    const goToCarts = () => {
        router.push("/user/cart")
    }

    const goToHome = () =>{
        router.push("/home")
    }

   return(
    <nav className={style["nav-container"]} style={{backgroundColor: theme.primaryColor}}>
    <div className={style["nav-top"]}>
        <div className={style["hamburger-menu"]}>
            <span style={{backgroundColor: theme.secondaryColor2}}></span>
            <span style={{backgroundColor: theme.secondaryColor2}} ></span>
            <span style={{backgroundColor: theme.secondaryColor2}}></span>
        </div>
        <Image src={logo} className={style["img-adjust-nav"]} alt='error' onClick={() => goToHome()}></Image>
        <div className={style["location-container"]}>
            <div className={style["location-button"]}>
                <div >
                    <i className="uil uil-location-point svg-adjust" id={style["svg-adjust1"]} style={{color: theme.secondaryColor2}}></i>
                </div>
                <div className={style["text-drop"]}>
                    <label className={style["font-label-adjust"]} style={{color: theme.secondaryColor2}}>Hello<br/>Select Address</label>
                </div>
            </div>
        </div>

        <div className={style["search-bar-container"]}>
            <input type="text" style={{backgroundColor: theme.searchBar}}  className={style["search-bar"]}></input>
            <button className={style["search-bar-button"]} style={{backgroundColor: theme.searchButton}}><i className="uil uil-search" style={{color: theme.searchIcon}} id={style["svg-adjust5"]}></i></button>
        </div>

        <div className={style["emoji-container"]} style={{borderColor: theme.secondaryColor2}}>
            <div className={style["round-button"]}></div>
            <i className="uil uil-bell" id={style["svg-adjust2"]} style={{color: theme.secondaryColor2}}></i>
        </div>

        <div className={style["emoji-container"]}  style={{borderColor: theme.secondaryColor2}}>
            <div className={style["round-button"]}></div>
            <Image className={style["emoji-adjust"]} src={bell} alt='error'></Image>
        </div>
   
        <label className={style["switch"]} style={{color: theme.secondaryColor2}}>
            <input type="checkbox" onChange={setNewTheme}  className={style["test"]}/>
            <span className={style["slider"] + " " + style["round"]}></span>
        </label>
       
        <div className={style["location-container"]} onClick={() => goToUserDetail()}>
            <div className={style["location-button"]}>
                <div >
                <i className="uil uil-user" id={style["svg-adjust3"]} style={{color: theme.secondaryColor2}}></i>
                </div>
                <div className='text-drop'>
                    <label className={style["font-label-adjust"]} style={{color: theme.secondaryColor2}}>Welcome<br/>{name}</label>
                </div>
            </div>
        </div>
        <div className={style["order-container"]}>
            <div className={style["location-button"]}>
                <div className={style["text-drop"]}>
                    <label className={style["font-label-adjust"]} style={{color: theme.secondaryColor2}}>Returns<br/>& Orders</label>
                </div>
            </div>
        </div>
        <div className={style["emoji-container"]} style={{borderColor: theme.secondaryColor2}} onClick={() => goToCarts()}>
            <div className={style["round-button"]} ></div>
            <i className="uil uil-shopping-cart" id={style["svg-adjust4"]} style={{color: theme.secondaryColor2}}></i>
        </div>
    </div>

        <div className={style["nav-bottom"]}>
            <div className={style["vertical-scroll"]}>
                <div style={{color: theme.secondaryColor2}}>Today's Best Deal</div>
                <div style={{color: theme.secondaryColor2}}>Best Sellers</div>
                <div style={{color: theme.secondaryColor2}}>Big Game TV Deals</div>
                <div style={{color: theme.secondaryColor2}}>RTX 4080/4090 Gaming Laptops</div>
                <div style={{color: theme.secondaryColor2}} >Valentines Day</div>
                <div style={{color: theme.secondaryColor2}}>PC Builder</div>
                <div style={{color: theme.secondaryColor2}}>VR</div>
                <div style={{color: theme.secondaryColor2}}>Browsing History</div>
                <div style={{color: theme.secondaryColor2}}>Gaming PC Finder</div>
            </div>
            <div className={style["nav-bottom-right"]}>
                <div className={style['nav-bottom-detail-container-2']} style={{color: theme.secondaryColor2}}>NEWEGG BUSINESS</div>
                <div className={style['nav-bottom-detail-container']} style={{backgroundColor: theme.searchButton, color: theme.primaryColor}}><i className="uil uil-feedback" style={{color: theme.primaryColor}}></i>FEEDBACK</div>
                <div className={style['nav-bottom-detail-container']} style={{backgroundColor: theme.searchButton, color: theme.primaryColor}}><i className="uil uil-question" style={{color: theme.primaryColor}}></i>HELP CENTER</div>
            </div>
        </div>
</nav>

   )
}