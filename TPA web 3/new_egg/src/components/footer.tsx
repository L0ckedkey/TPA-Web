import Link from "next/link";
import style from '../styles/pages.module.css'
import logo from "../assets/laptop_footer.png"
import Image from "next/image";
import { ThemeContext } from './theme'
import { useContext } from 'react'

export default function Footer(){
    const {theme, setNewTheme} = useContext(ThemeContext)
    return(
        <div className={style["drop"]} style={{backgroundColor: theme.footerColor2}}>
            <div className={style["footer-top"]} style={{backgroundColor: theme.footerColor2}}>
                <div className={style["footer-top-content-big"]} style={{backgroundColor: theme.footerColor3}}>
                    {/* <Image src={logo} width={100} height={100} alt="error" className={style["img-adjust-footer"]}></Image> */}
                    <div className={style["footer-drop-container"]}>
                        <div style={{color: theme.iconColor}}>DEALS JUST FOR YOU</div>
                        <div>
                            <div style={{color: theme.iconColor}}>
                                Sign Up to receive exclusive offers in your inbox
                            </div>
                            <div>
                                <input type={"text"} placeholder="Enter your email address" className={style["email-address-footer"]}></input>
                            </div>
                        </div>
                        <div style={{color: theme.iconColor}}>
                            View Latest Detail
                        </div>
                    </div>
                </div>
                <div className={style["footer-top-content-small"]} style={{backgroundColor: theme.footerColor3, color:theme.iconColor}}>
                    q
                </div>
            </div>
            <footer className={style["footer"]} style={{backgroundColor: theme.secondaryColor}}>
                <div className={style["footer-container"]}>
                    <div className={style["content"]}>
                        <div className={style["header-content"]}>CUSTOMER SERVICE</div>
                        <div className={style["content-detail"]}>
                            <a>Help Center</a>
                            <a>Track an Order</a>
                            <a>Return an Item</a>
                            <a>Return Policy</a>
                            <a>Privacy & Security</a>
                            <a>Feedback</a>
                        </div>
                    </div>
                    <div className={style["content"]}>
                        <div className={style["header-content"]}>MY ACCOUNT</div>
                        <div className={style["content-detail"]}>
                            <Link href="/signIn"><div className={style["font-color-white"]}>Login/Register</div></Link>
                            <a>Order History</a>
                            <a>Returns History</a>
                            <a>Address Book</a>
                            <a>Wish Lists</a>
                            <a>My Build Lists</a>
                            <a>Email Notification</a>
                            <a>Subscription Order</a>
                            <a>Auto Notifications</a>
                        </div>
                    </div>
                    <div className={style["content"]}>
                        <div className={style["header-content"]}>COMPANY INFORMATION</div>
                        <div className={style["content-detail"]}>
                            <a>About Newegg</a>
                            <a>Investor Relations</a>
                            <a>Awards/Rankings</a>
                            <a>Hours and Locations</a>
                            <a>Press Inqui</a>
                            <a>My Build Lists</a>
                            <a>Email Notification</a>
                            <a>Subscription Order</a>
                            <a>Auto Notifications</a>
                        </div>
                    </div>
                    <div className={style["content"]}>
                        <div className={style["header-content"]}>TOOLS & RESOURCE</div>
                        <div className={style["content-detail"]}>
                            <a>Sell on Newegg</a>
                            <a>Investor Relations</a>
                            <a>Awards/Rankings</a>
                            <a>Hours and Locations</a>
                            <a>Press Inquiries</a>
                            <a>Newegg Careers</a>
                            <a>Newsroom</a>
                            <a>Newegg Insider</a>
                            <a>Calif. Transparancy in Supply Chains Act</a>
                        </div>
                    </div>
                    <div className={style["content"]}>
                        <div className={style["header-content"]}>SHOP OUR BRANDS</div>
                        <div className={style["content-detail"]}>
                            <a>Newegg Business</a>
                            <a>Newegg Global</a>
                            <a>ABS</a>
                            <a>Rosewell</a>
                        </div>
                    </div>
                </div>
            </footer>
            <div className={style["footer-bottom"]}>
                <div className={style["footer-label"]}>
                    <div style={{color: theme.iconColor}}>
                    © 2000-2023 Newegg Inc.  All rights reserved.
                    </div>
                    <div className={style["footer-label-detail"]}>
                        <Link href="/home">Terms & Conditions</Link> <Link href="/home">Privacy Policy</Link> <Link href="/home">Cookie Preferences</Link>
                    </div>
                </div>
                <div className={style["footer-bottom-right"]}>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-twitter" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-facebook-f" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-instagram-alt" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-linkedin" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-instagram-alt" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}> 
                            <i className="uil uil-youtube" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-instagram-alt" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-discord" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                    <div>
                        <div className={style["round"]} style={{backgroundColor: theme.iconColor}}>
                            <i className="uil uil-instagram-alt" style={{color: theme.primaryColor}}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}