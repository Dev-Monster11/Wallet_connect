import Slider from "react-slick";
import metamask from "../assets/images/metamask.png";
import trustwallet from "../assets/images/trustwallet.png";
import slide1 from "../assets/images/slide1.gif";
import slide2 from "../assets/images/slide2.gif";
import slide3 from "../assets/images/slide3.gif";
import slide4 from "../assets/images/slide4.gif";
import slide5 from "../assets/images/slide5.gif";
import slide6 from "../assets/images/slide6.gif";
import gif from "../assets/images/gifius.gif";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { connectWallet } from "../utils/connectWallet";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../utils/connectors";
import NFTSaleAbi from "../contract/NFTsale.json";
import { nFTsale_addr } from "../contract/addresses";
import { ethers, BigNumber } from "ethers";
import { isMobile } from "react-device-detect";
import platform from "platform";
import detectEthereumProvider from "@metamask/detect-provider";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  Button,
  NavDropdown,
  Modal,
} from "react-bootstrap";

const apiUrl = process.env.REACT_APP_API_URL + "/api";

function Home() {
  // Microsoft Edge
  // Chrome
  // Safari

  const [checkMetamask, setCheckMetamask] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const jj = async () => {
    const providerMetamask = await detectEthereumProvider();
    if (providerMetamask) {
      // console.log("providerMetamask", providerMetamask)
      // console.log('Ethereum successfully detected!')
      setCheckMetamask(true);
    } else {
      console.error("Please install MetaMask!");
    }
  };

  useEffect(() => {
    jj();
  });

  const {
    connector,
    library,
    account,
    chainId,
    activate,
    deactivate,
    active,
    errorWeb3Modal,
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();

  const [loaded, setLoaded] = useState(false);
  const [salePrice, setSalePrice] = useState(0);
  const [supplyy, setMaxSupply] = useState(0);
  const [totalEth, setTotalEth] = useState();
  const [tokenCount, setTokenCount] = useState();
  const [qty, setQty] = useState(0);

  const [supply, setSupply] = useState();
  const [price, setPrice] = useState(0);
  const [max, setMax] = useState();
  const [barImage, setBarImage] = useState();
  const [backgroundImage, setBackgroundImage] = useState();
  const [headContent, setHeadContent] = useState();
  const [timerShow, setTimerShow] = useState(false);
  const [timer, setTimer] = useState();

  const [sliderImages, setSliderImages] = useState([
    {
      id: "",
      heading: "",
      image: "",
      img_src: "",
    },
  ]);

  useEffect(() => {
    injectedConnector
      .isAuthorized()
      .then((isAuthorized) => {
        setLoaded(true);
        if (isAuthorized && !networkActive && !networkError) {
          activateNetwork(injectedConnector);
        }
      })
      .catch(() => {
        setLoaded(true);
      });
  }, [activateNetwork, networkActive, networkError]);

  useEffect(() => {
    console.log(typeof window !== "undefined" ? window.location.href : "null");
  }, []);

  //   const detect = async () => {
  //     const provider = await detectEthereumProvider();

  //   if (provider) {
  //     // console.log('Metamask Installed')
  //     return
  //   } else {
  //     setDetectMetamask("Install Metamask")
  //   }
  //   }
  //   detect()

  const loadProvider = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      return provider.getSigner();
    } catch (e) {
      console.log("loadProvider default: ", e);
    }
  };

  const getSalePrice = async () => {
    try {
      let signer = await loadProvider();
      let NFTSaleContract = new ethers.Contract(
        nFTsale_addr,
        NFTSaleAbi,
        signer
      );
      // console.log("NFTSaleContract", NFTSaleContract)
      let SalePrice = await NFTSaleContract.SalePrice();
      let maxSupply = await NFTSaleContract.maxSupply();

      setSalePrice(ethers.utils.formatEther(SalePrice.toString()));
      setMaxSupply(maxSupply.toString());
      // console.log("maxSupply", maxSupply)
    } catch (e) {
      console.log("err>", e);
    }
  };
  // console.log("salePrice", salePrice)
  // console.log("tokenCount", tokenCount)
  // console.log("mul",   qty * 0.11)

  const BuyToken = async () => {
    try {
      // console.log("Tokjen")
      let signer = await loadProvider();
      let NFTSaleContract = new ethers.Contract(
        nFTsale_addr,
        NFTSaleAbi,
        signer
      );
      let mul = (qty * salePrice).toString();
      // console.log("hdhjk",mul)
      let _value = ethers.utils.parseEther(mul);
      // console.log("value", _value)
      let buyToken = await NFTSaleContract.buyToken(qty, { value: _value });
      await buyToken.wait();
      // console.log("hello")
    } catch (e) {
      console.log("err>,", e);
    }
  };

  //   const handleSubmit =  () => {
  //     // event.preventDefault()
  //     if( qty !== 0){
  //       BuyToken()
  //     }
  //     console.log("hello")
  // }

  const handleSubmit = () => {
    handleShow1();
  };

  useEffect(() => {
    (async () => {
      if (account) {
        try {
          getSalePrice();
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [account]);

  const settings = {
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: sliderImages.length - 1,
          autoplay: true,
          autoplaySpeed: 0,
          speed: 2000,
          cssEase: "linear",
          infinite: true,
          vertical: false,
          arrows: false,
          swipe: false,
          slidesToScroll: 3,
          vertical: false,
        },
      },
    ],
  };

  const increase = () => {
    if (qty < 20) {
      setQty(qty + 1);
    }
  };

  const decrease = () => {
    if (qty > 0) {
      setQty(qty - 1);
    }
  };

  const calculateTimeLeft = () => {
    let year = new Date().getFullYear();
    let difference = +new Date(`5/01/${year}`) - +new Date();

    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Min: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timerId = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timerId);
  }, [setTimeLeft]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setTimeLeft(calculateTimeLeft());
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    return (
      <span className="timer-inner">
        {timeLeft[interval]} <br />
        {interval}{" "}
      </span>
    );
  });

  useEffect(() => {
    fetch(apiUrl + "/mythia.php/?req=" + "slider")
      .then((response) => response.json())
      .then((data) => {
        setSliderImages(data);
      })
      .catch(console.log);
  }, [setSliderImages]);

  useEffect(() => {
    fetch(apiUrl + "/mythia.php/?req=" + "data")
      .then((response) => response.json())
      .then((data) => {
        setSupply(data.supply);
        setPrice(data.price);
        setMax(data.max);
        setBarImage(data.bar_image);
        setBackgroundImage(data.background_image);
        setHeadContent(data.headcontent);
        setTimerShow(data.timershow === "1" ? true : false);
        setTimer(data.timer);

        // Timer
        const calculatedTimeLeft = calculateTimeLeft(data.timer);
        setTimeLeft(calculatedTimeLeft);
      })
      .catch(console.log);
  }, [setTimeLeft]);

  return (
    <>
      <section className="main">
        <div className="main-flex">
          {sliderImages.length > 0 && (
            <Slider {...settings} className="slider">
              {sliderImages.map((image) => {
                return <img key={image.id} src={image.img_src} />;
              })}
            </Slider>
          )}

          <div className="right-form">
            <h2>{headContent}</h2>
            <h3>{timer}</h3>

            {/* <div className="timer">
                            {timerShow && <h2>{timerComponents} <span>Mint Now</span></h2>}
                        </div> */}

            <div className="supply-details">
              <div>
                <p>Supply</p>
                <span>{supplyy}</span>
              </div>

              <div>
                <p>Price</p>
                <span>{price} ETH</span>
              </div>

              <div>
                <p>Max</p>
                <span>{max}</span>
              </div>
            </div>

            <div className="form-box">
              <div className="timer">
                {/* {timerComponents && <h2>{timerComponents} 
                            <span>Mint Now</span>
                            </h2>} */}

                {timerComponents.length ? (
                  <h2>{timerComponents}</h2>
                ) : (
                  <h2>Mint Now</h2>
                )}
              </div>

              <h1>Bonus Sale</h1>

              {/* <form> */}

              <div className="price-per-nft">
                <img src={gif} />

                <div className="price">
                  <p>Price Per NFT</p>
                  <h3>{price}</h3>
                  {/* <h3>{salePrice}</h3> */}
                </div>
              </div>

              <div className="min-max">
                <div className="increament">
                  <div
                    className="value-button decrease"
                    id="decrease"
                    value="Decrease Value"
                    onClick={(e) => decrease()}
                  >
                    -
                  </div>
                  <input
                    type="number"
                    id="room-number"
                    value={qty}
                    min="1"
                    max="20"
                    className="number"
                    readOnly
                  />
                  <div
                    className="value-button increase"
                    id="increase"
                    value="Increase Value"
                    onClick={(e) => increase()}
                  >
                    +
                  </div>
                </div>

                <button className="custom-btn-sm">Set max</button>
              </div>

              <div className="total-mint">
                <p>Total</p>
                {/* <p>{qty * salePrice}</p> */}
                <p>{qty * price}</p>
              </div>

              <div>
                <div style={{ textAlign: "center" }}>
                  {networkError ? (
                    <button type="button" className="custom-btn-sm">
                      Connect Wallet
                    </button>
                  ) : active ? (
                    <div>{/* <button>{handleSubmit}Mint</button> */}</div>
                  ) : (
                    <Modal
                      show={show1}
                      onHide={handleClose1}
                      className="custom-modal"
                      aria-labelledby="contained-modal-title-vcenter"
                      centered
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "black",
                        }}
                      >
                        <div
                          style={{ paddingLeft: "3rem", paddingTop: "1rem" }}
                        >
                          {checkMetamask == false ? (
                            <a
                              style={{ textDecoration: "none" }}
                              href="https://metamask.app.link/dapp/albertnft.pluton.ltd/"
                            >
                              <img
                                src={metamask}
                                width="20%"
                                style={{ height: "80px" }}
                              />
                              <span
                                style={{ paddingLeft: "1rem", color: "white" }}
                              >
                                Metamask
                              </span>
                              {/* <button className="custom-btn-sm">
                  Connect to MetaMask
                </button> */}
                            </a>
                          ) : (
                            <button
                              className="custom-btn-sm"
                              onClick={() => {
                                connectWallet(activate);
                              }}
                              type="button"
                            >
                              {/* Connect Wallet */}
                              MINT
                            </button>
                          )}
                        </div>

                        <div
                          style={{
                            paddingLeft: "3rem",
                            paddingTop: "2rem",
                            paddingBottom: "1rem",
                          }}
                        >
                          {checkMetamask == false ? (
                            <a
                              style={{ textDecoration: "none" }}
                              href="https://link.trustwallet.com/open_url?coin_id=60&url=https://albertnft.pluton.ltd/"
                            >
                              <img src={trustwallet} width="20%" />
                              <span
                                style={{ paddingLeft: "1rem", color: "white" }}
                              >
                                {/* Trust Wallet */}
                                MINT
                              </span>
                              {/* <button className="custom-btn-sm">
                  Connect to MetaMask
                </button> */}
                            </a>
                          ) : (
                            <button
                              className="custom-btn-sm"
                              onClick={() => {
                                connectWallet(activate);
                              }}
                              type="button"
                            >
                              {/* Connect Wallet */}
                              MINT
                            </button>
                          )}
                        </div>
                      </div>
                    </Modal>
                  )}
                </div>

                <div>
                  {account ? (
                    <button
                      className="custom-btn-sm"
                      style={{ textAlign: "center" }}
                      onClick={BuyToken}
                    >
                      Mint
                    </button>
                  ) : null}
                </div>
              </div>

              <button onClick={handleSubmit} className="custom-btn-sm">
                MINT
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
