import { injectedConnector } from "./connectors";
import Onboard from 'bnc-onboard'

export const connectWallet = async(activate,errorMessageCallback)=>{
    
    // await activate(injectedConnector, async (error) => {
    //     console.log({ error });
    //     errorMessageCallback(error.message);
    // });

    const onboard = Onboard({
        dappId: 'e5dce034-797e-4871-8a93-ef69730dca19',
        networkId: 1,
        darkMode: true,
        subscriptions: {
          wallet: async (wallet) => {
            if (wallet.provider) {
            //   const provider = new ethers.providers.Web3Provider(wallet.provider, 'any')
            //   const signer = provider.getSigner();
            //   const account = await signer.getAddress()
            } else {
            //   dispatch(connectFailed({
            //     account: null,
            //     provider: null
            //   }))
            }
          }
        },
        // walletSelect: {
        //   wallets: [{
        //     walletName: 'metamask'
        //   }]
        // }
    })
    await onboard.walletSelect()
    await onboard.walletCheck()
}