'use client'

import {Toaster} from "react-hot-toast";
import {OurContextProvider} from "../context/OurContext";
import "../styles/globals.css";
import "animate.css";

import client  from "../lib/apolloClient"
import { ApolloProvider } from "@apollo/client";


{/*tripscontextprovider*/}

function MyApp({Component, pageProps}) {
  return (
    <ApolloProvider client={client}>
    <OurContextProvider>
      
        <Component {...pageProps} />
        <Toaster />
  
    </OurContextProvider>
    </ApolloProvider>
  );
}

export default MyApp;
