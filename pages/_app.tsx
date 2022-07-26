import "../styles/globals.css";
import type { AppProps } from "next/app";
// import Login from "./Login";
// import Signup from "./Signup";
// import Phone from "./Phone";
// import Otp from "./otp";
// import First from "./First";
//import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
    // <>
      
    //   <Component {...pageProps} >
       
    //     </Component>
    // </>
  );
}

export default MyApp;
