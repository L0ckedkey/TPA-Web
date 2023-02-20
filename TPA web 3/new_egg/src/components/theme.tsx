import { createContext, useState } from "react"

export const THEME = {
    light:{
        primaryColor: "#FFFFFF",
        secondaryColor: "#0A185C",
        iconColor: "#212121",
        buttonColor1: "#6694EA",
        buttonColor2: "#363636",
        searchBar: "#EEEAFF",
        searchButton: "#2647BB",
        searchIcon: "#FFFFFF",
        secondaryColor2:"#000000",
        switchColor:"#F2F2F2",
        footerColor2: "#F6F8FE",
        footerColor3: "#E3EAFC"
    },
    dark:{
        primaryColor: "#070C2F",
        secondaryColor: "#121212",
        iconColor: "#FFFFFF",
        buttonColor1: "#1946B8",
        buttonColor2: "#363636",
        searchBar: "#23115E",
        searchIcon: "#000000",
        searchButton: "#6E95ED",
        secondaryColor2: "#FFFFFF",
        switchColor:"#E05D00",
        footerColor2: "#262626",
        footerColor3: "#333333"
    }
}

// export const ThemeContext = createContext(THEME.light)
export const ThemeContext = createContext({theme: THEME.light, setNewTheme: () => {}})

export const ThemeProvider = ({children}: any) => {
    const [theme, setTheme] = useState(THEME.light)
    const setNewTheme = () => {
        setTheme(previous => previous === THEME.light ? THEME.dark : THEME.light)
    }

    return (<ThemeContext.Provider value = {{theme,setNewTheme}}>
        {children}</ThemeContext.Provider>)
}