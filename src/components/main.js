import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import moment from "moment";
import Slider from "react-slick";
import gif from "../assets/images/gifius.gif";
import NFTSaleAbi from "../contract/NFTsale.json";
import { nFTsale_addr } from "../contract/addresses";
import Onboard from 'bnc-onboard'

const apiUrl = process.env.REACT_APP_API_URL + "/api";

export default function Main() {
  const [connect, setConnect] = useState(false)
  const [count, setCount] = useState(1)
  const [socialLinks, setSocialLinks] = useState([]);

  const [price, setPrice] = useState(0);
  const [max, setMax] = useState();
  const [headContent, setHeadContent] = useState();
  const [totalNft, setTotalNft] = useState(0);
  const [saleNtf, setSaleNtf] = useState(0);
  const [mainHeading, setMainHeading] = useState('');
  const [timer, setTimer] = useState();
  const [supply, setSupply] = useState(0)
  const [sliderImages, setSliderImages] = useState([
    {
      id: "",
      heading: "",
      image: "",
      img_src: "",
    },
  ]);

  const settings = {
    slidesToShow: sliderImages.length - 1,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 2000,
    cssEase: "linear",
    infinite: true,
    vertical: true,
    arrows: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          vertical: false,
        },
      },
    ],
  };

  const onMintPressed = async () => {
    
  }
  const onPlus = () => {
    if (count < 20) setCount(count + 1)
    else setCount(20)
  }
  
  const onMinus = () => {
    if (count > 1) setCount(count - 1)
    else setCount(1)
  }
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
        setHeadContent(data.headcontent);
        setTimer(data.timer);
        setTotalNft(data.total_nft);
        setSaleNtf(data.total_nft_sale);
        setMainHeading(data.mainheading);

        // Timer
        const calculatedTimeLeft = calculateTimeLeft(data.timer);
        setTimeLeft(calculatedTimeLeft);
      })
      .catch(console.log);
  }, [setTimeLeft]);

  const connectWalletPressed = async () => {
    const onboard = Onboard({
      dappId: 'e5dce034-797e-4871-8a93-ef69730dca19', //e5dce034-797e-4871-8a93-ef69730dca19
      networkId: 1,
      darkMode: true,
      subscriptions: {
        wallet: async (wallet) => {
          if (wallet.provider) {
            setConnect(true)
          } else {
            setConnect(false)
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

  };

  return(
    <section className='main'>
      <ul className="social">
        {socialLinks.map((link, key) => {
          return (
            <li>
              <a href={link.url} target="_blank">
                <i class={link.class}></i>
              </a>
            </li>
          );
        })}
      </ul>

      <div className='main-flex'>
        {sliderImages.length > 0 && (
          <Slider {...settings} className="slider">
            {
              sliderImages.map((image) => {
                return <img key={image.id} src={image.img_src} />
              })
            }
          </Slider>
        )}
        <div className="right-form">
            <h2>{headContent}</h2>
            <h3>{moment(timer).format("MMMM Do YYYY")}</h3>

            <div className="supply-details">
              <div>
                <p>Supply</p>
                <span>{supply}</span>
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
                {timerComponents.length ? (
                  <h2>{timerComponents}</h2>
                ) : (
                  <h2>Mint Now</h2>
                )}
              </div>

              <h1>{mainHeading}</h1>

              <div className="price-per-nft">
                <img src={gif} />

                <div className="price">
                  <p>Price Per NFT</p>
                  <h3>{price}</h3>
                </div>
              </div>

              <div className="min-max">
                <div className="increament">
                  <div
                    className="value-button decrease"
                    id="decrease"
                    value="Decrease Value"
                    onClick={(e) => onMinus()}
                  >
                    -
                  </div>
                  <input
                    type="number"
                    id="room-number"
                    value={count}
                    min="1"
                    max="20"
                    className="number"
                    readOnly
                  />
                  <div
                    className="value-button increase"
                    id="increase"
                    value="Increase Value"
                    onClick={(e) => onPlus()}
                  >
                    +
                  </div>
                </div>

                <button className="custom-btn-sm">Set max</button>
              </div>

              <div className="total-mint">
                <p>Total</p>
                {/* <p>{count * salePrice  }</p> */}
                <p>{count * price}</p>
              </div>
            
              <div>
                <div style={{ textAlign: "center" }}>
                  {connect ? (
                    <button type="button" className="btn-custom secondary-btn">
                      {/* Connect Wallet */}
                      MINT
                    </button>
                  ) : (
                    <div>
                      <button
                        className="custom-btn-sm"
                        onClick={connectWalletPressed}
                        type="button"
                      >
                        {/* Connect Wallet */}
                        MINT
                      </button>
                    </div>
                  )}
                </div>

                {/* <div>
                  {account ? (
                    <button
                      className="custom-btn-sm"
                      style={{ textAlign: "center" }}
                      onClick={() => handleSubmit()}
                    >
                      Mint
                    </button>
                  ) : null}
                </div> */}
              </div>
              <br />
              <h6>{saleNtf}/{totalNft}</h6>
              {/* <div>
                {
                        isMobile == true && window.location.href == "https://albert_nft.surge.sh/" ? <a href="https://metamask.app.link/dapp/albert_nft.surge.sh/">
                        <button  >
                          Connect to MetaMask
                        </button>
                    </a> : console.log("sorry")
                      }
                </div> */}

              {/* </form> */}
            </div>
          </div>
      </div>
    </section>
  )
}