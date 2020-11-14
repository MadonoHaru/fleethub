import React from "react"
import { NextComponentType } from "next"
import { AppContext, AppInitialProps, AppProps } from "next/app"
import { CacheProvider } from "@emotion/core"
import createCache from "@emotion/cache"

import { ThemeProvider } from "../styles"

export const cache = createCache({ key: "css" })

const MyApp: NextComponentType<AppContext, AppInitialProps, AppProps> = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  return (
    <CacheProvider value={cache}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  )
}

export default MyApp