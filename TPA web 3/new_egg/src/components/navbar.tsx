import Image from 'next/image'
import { useContext, useEffect, useState, useSyncExternalStore } from 'react'
import { ThemeContext } from './theme'
import bell from '../assets/bell.png'
import logo from '../assets/logo.png'
import style from '../styles/pages.module.css'
import { getName, getRole, getUserID } from '@/utiil/token'
import { useRouter } from 'next/router'
import  Axios  from 'axios'
import Menu from './menu'



export function Address(props:any){
    const getAddresses = "http://localhost:8080/getAccountAddress"
    const getAddress = "http://localhost:8080/getAddressbyID"
    const addAddress = "http://localhost:8080/addAddress"
    const [addresses, setAddresses] = useState([])
    const [address, setAddress] = useState('')
    const [inputLocation, setInputLocation] = useState('')
    const [userID, setUserID] = useState('')

   
    const handleInputChange = (event:any) => {
        console.log(props)
        setAddress(event);
        props.onChange(event);
        // props.onUpdateAddress(event);
    }


    useEffect(() => {

        const getCurName = async () => {
            var name = await getUserID()
            setUserID(name)
        }
        
        getCurName()      
    }, [])

    useEffect(() => {
        if(userID != ""){
            Axios.get(getAddresses, {
                params:{
                    accountID: userID
                }
            }).then(function (response) {
                console.log(response.data);
                setAddresses(response.data)
                setAddress(response.data[0].Location)
                handleInputChange(response.data[0].Location)
            })
            .catch(function (error) {
            //   console.log(error);
            })
            .then(function () {
            // always executed
            });  
        }
    }, [userID])


    const addAddressToDB = () => {
        Axios.get(addAddress, {
            params:{
                accountID: userID,
                location: inputLocation
            }
        }).then(function (response) {
           console.log(response.data)

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
            <div className={style["address-container"]}>
                <div className={style["places-container"]}>
                    {
                        addresses.map((address:any) => {
                            return(
                                <button key={address.ID} onClick={() => handleInputChange(address.Location)}>{address.Location}</button>
                            )
                        })
                    }
                </div>
                <div className={style["input-address-container"]}>
                    <input type={"text"} placeholder={"input location"} onChange={(e) => setInputLocation(e.target.value)}></input>
                    <button onClick={() => addAddressToDB()}>Add Address</button>
                </div>
            </div>
        </div>
    )
}


export default function Navbar({onLangChange, onAddressUpate}){
    
    const {theme, setNewTheme} = useContext(ThemeContext)
    const [address, setAddress] = useState('')
    const [name, setName] = useState('')
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [lang, setNewLang] = useState('')
    const [searchBox, setSearchBox] = useState(false)
    const [products, setProducts] = useState([])
    const [brands, setBrands] = useState([])
    const [showMenu, setShowMenu] = useState(false)
    const [changeAddress, setChangeAddress] = useState(false);
    const [role, setRole] = useState('')
    const link = "http://localhost:8080/getProductsByNameDistinct"
    const link2 = "http://localhost:8080/getProductsByProductDistinct"
    useEffect(() => {

        const getCurName = async () => {
            var name = await getName()
            // console.log("name navbar " + name)
            if(name == null){
                setName("Sign In / Register")
            }else{
                setName(name)
            }
        }
        
        getCurName()      
        
         
    }, [])

    const updateAddresses = (newAddresses:any) => {
        // console.log("here");
        
        console.log(newAddresses)
        setAddress(newAddresses);
        // onAddressUpate(newAddresses)
        if(onAddressUpate){
            onAddressUpate(newAddresses)
        }
    };
    

    const showSearchBar = () => {
        // console.log("here")
        if(searchBox){
            setSearchBox(false)
        }else{
            setSearchBox(true)
        }
        // console.log(searchBox)
    }

    const handleSearch = (event:any) => {
        setSearch(event.target.value)
        // onSearchFilter(search)

        Axios.get(link, {
            params:{
                name: search
            }
        }).then(function (response) {
           setProducts(response.data)
        //    console.log(response.data)
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  

        Axios.get(link2, {
            params:{
                name: search
            }
        }).then(function (response) {
           setBrands(response.data)
           console.log(response.data.Brand.Name )
        })
        .catch(function (error) {
        //   console.log(error);
        })
        .then(function () {
        // always executed
        });  

    }

    const handleClick = () => {
        if(lang == 'en'){
            setNewLang('id')
        }else{
            setNewLang('en')
        }
        // console.log(lang)
        onLangChange(lang)
    };


    useEffect(() => {
        // console.log(search)
        // getSearch(search)
    })

    const goToUserDetail = () => {
        router.push("/user")
    }

    const goToCarts = () => {
        router.push("/user/cart")
    }

    const goToHome = () =>{
        router.push("/home")
    }

    const handleClickSearch = (props:any) => {
       router.push("/product/home/" + props)
    }

    const handleClickBrand = (props:any) => {
        router.push("/product/brand/" + props)
    }

    const showFloatingMenu = () =>{
        if(showMenu){
            setShowMenu(false)
        }else{
            setShowMenu(true)
        }
    }

    const changeAddressMenu = () => {
        if(changeAddress){
            setChangeAddress(false)
        }else{
            setChangeAddress(true)
        }
    }

   return(
    <nav className={style["nav-container"]} style={{backgroundColor: theme.primaryColor}}>
    <div className={style["nav-top"]}>
        <div className={style["hamburger-menu"]} onClick={() => showFloatingMenu()}>
            <span style={{backgroundColor: theme.secondaryColor2}}></span>
            <span style={{backgroundColor: theme.secondaryColor2}} ></span>
            <span style={{backgroundColor: theme.secondaryColor2}}></span>
        </div>
        <Image src={logo} className={style["img-adjust-nav"]} alt='error' onClick={() => goToHome()}></Image>
        <div className={style["location-container"]}>
            <div className={style["location-button"]} onClick={() => changeAddressMenu()}>
                <div >
                    <i className="uil uil-location-point svg-adjust" id={style["svg-adjust1"]} style={{color: theme.secondaryColor2}}></i>
                </div>
                <div className={style["text-drop"]}>
                    <label className={style["font-label-adjust"]} style={{color: theme.secondaryColor2}}>Hello<br/>{address}</label>
                </div>
            </div>
            {
                changeAddress ?
                <Address onChange={updateAddresses} />:null
            }
        </div>

        <div className={style["search-bar-container"]} onClick={showSearchBar}>
            <input type="text" style={{backgroundColor: theme.searchBar}}  className={style["search-bar"]} onChange={(event) => handleSearch(event)} ></input>
            <button className={style["search-bar-button"]} style={{backgroundColor: theme.searchButton}}><i className="uil uil-search" style={{color: theme.searchIcon}} id={style["svg-adjust5"]}></i></button>
        </div>
        
            {searchBox ?  
                <div className={style["search-box"]}>
                    <div className={style["search-container"]}>
                        <div className={style["product-search"]}>      
                            {   
                                products ? products.map((product:any) => {
                                return(<button key={product.ID} className={style["button-product-search"]} onClick={() => handleClickSearch(product.ProductName)}>{product.ProductName}</button>)
                                }): null
                            }
                        </div>
                        <div className={style["product-search"]}>
                            {
                                brands ? brands.map((product:any) => {
                                    // console.log(product)
                                return(<button key={product.Brand.ID} className={style["button-product-search"]} onClick={() => handleClickBrand(product.Brand.Name)}>{product.Brand.Name}</button>)
                                }):null
                            }
                        </div>
                    </div>
                </div>
            : null}
        

        <div className={style["emoji-container"]} style={{borderColor: theme.secondaryColor2}}>
            <div className={style["round-button"]}></div>
            <i className="uil uil-bell" id={style["svg-adjust2"]} style={{color: theme.secondaryColor2}}></i>
        </div>

        <select className={style["emoji-container"]}  style={{borderColor: theme.secondaryColor2}} onChange={handleClick} value={lang}>
            <option value={'id'}>English</option>
            <option value={'en'}>Indonesia</option>
        </select>
   
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
                <div style={{color: theme.secondaryColor2}}>Valentines Day</div>
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
        {
            showMenu ? <Menu/>:null
        }
</nav>
    
   )
}