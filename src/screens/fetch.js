import React,{useEffect} from "react";

const fetch = () => {

    const y = () => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.1/dist/umd/index.min.js";
           script.async = true;
           let u = document.body.appendChild(script);
            console.log("u", u)

            
    }

    y()

    // useEffect(() => {
    //     const script = document.createElement('script');
      
    //     script.src = "https://cdn.jsdelivr.net/npm/@walletconnect/web3-provider@1.7.1/dist/umd/index.min.js";
    //     script.async = true;
      
    //     document.body.appendChild(script);
      
    //   }, []);

    return(<div>
        hello
    </div>)
}

export default fetch