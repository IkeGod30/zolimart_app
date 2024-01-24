import "./ProductImg.css";
import { useState } from "react";
// import Toastalert from "../Toast/Toast";
import OfferCount from "../OfferCount/OfferCount";
import ProductImg from "../ProductImg/ProductImg";

function ProdImg() {
  const [counterOff, setcounterOff] = useState(0);
  const [offersubmit, setoffersubmit] = useState(0);
  const [UserOffer, setUserOffer] = useState(0);
  const [counterOffer, setcounterOffer] = useState();
  const [Offercount, setOffercount] = useState(0);
  const [btnTitle, setbtnTitle] = useState(true);
  // const NumberOfDiscounts = [];
  const TotalOfferCount = 4;

  function changeOffercount() {
    setOffercount(Offercount + 1);
  }

  function handleBtnTitle() {
    setbtnTitle(!btnTitle);
  }

  function changeUserOffer(e) {
    // if (
    //   e.key === "Enter" &&
    //   e.target.value.trim() !== "" &&
    //   typeof e.key == NaN
    // ) {
    setUserOffer(e.target.value);
    // }
  }

  function changeCounterOffer(offerPercent) {
    // Check !!! //
    setcounterOffer(offerPercent); // Set argument with state also
    // setTimeout(() => {
    //   setcounterOff(offerPercent);
    // }, 5000);
  }

  // function offerChange() {
  //   setoffersubmit(submitOffer);
  // }

  const asking = 45;
  let Offer = UserOffer;
  const DiscountTen = asking * 0.1;
  const DiscountFive = asking * 0.05;
  const DiscountTwenty = asking * 0.2;
  const DiscountThirty = asking * 0.3; // Unused

  const OfferTen = asking - DiscountTen;
  const OfferFive = asking - DiscountFive;
  const OfferTwenty = asking - DiscountTwenty;
  const OfferThirty = asking - DiscountThirty; // Unused

  // const TotalOfferCount = [
  //   DiscountFive,
  //   DiscountTen,
  //   DiscountTwenty,
  //   DiscountThirty,
  // ]; //

  // let counterOffer = null;
  // function prom() {
  //   prompt("Please type in your offer");
  // }

  // function changeOffer() {
  //   setcounterOff(asking * 0.4);
  // }

  function OfferPrice() {
    // const Offer = 0;
    // const LAST_PRICE = askingPrice * 0.15;
    // let Offered_price = e.target.value;

    // switch (Offer) {
    //   case 40:
    //     alert("Offer accepted!");
    //   case 20:
    //     alert("Offer NOT accepted");

    // default:
    //   return alert(asking);
    // for (Offer = 30; Offer++; ) {
    //   alert("First Counter");
    // }

    if (Offer < asking - asking * 0.3 && Offer !== asking) {
      // 31.5
      changeCounterOffer(OfferTen);
      changeOffercount();

      /// #### Used to delay the above code execution #####

      // setTimeout(() => {
      //   changeCounterOffer(OfferTen);
      //   changeOffercount();
      // }, 5000);

      // alert("Congratulations! Your Offer has been accepted");
    } else if (Offer > asking - asking * 0.35 && Offer !== asking) {
      // 29.25

      changeCounterOffer(OfferFive);
      changeOffercount();
    } else if (Offer > asking - asking * 0.4 && Offer !== asking) {
      // 27

      changeCounterOffer(OfferTwenty);
      changeOffercount();
    } else if (Offer > asking - asking * 0.3 && Offer !== asking) {
      // 31.5
      changeCounterOffer(OfferThirty);
      changeOffercount();
    }

    if (Offer == asking) {
      alert("Your Offer matches the asking price.");
      changeCounterOffer(asking);
      changeOffercount();
      setOffercount(Offercount);
    } else if (Offer > asking) {
      alert(
        "Your offer is above the Asking Price. Please make an offer equal or below the Asking Price"
      );

      changeCounterOffer(asking);
      setOffercount(Offercount);
    }

    if (Offer == 0) {
      alert("Offer cannot be zero");
      changeCounterOffer(null);
      setOffercount(Offercount);
    }
  }

  // if (Offercount > TotalOfferCount) {
  //   alert("You have reached the maximum number of offer");
  //   setOffercount(OfferCount);
  // }

  //   if (Offer >= asking) {
  //     alert("Congratulations! Your Offer has been accepted");
  //   } else {
  //     alert("I'm making counter of..." + OfferTen);
  //   }
  // }

  return (
    <>
      <div
        className="card"
        style={{
          width: "23rem",
          height: "510px",
          margin: "0 auto",
          borderRadius: "5px",
          border: "solid gray 1px",
        }}
      >
        <ProductImg />

        {/* <img
          width="100%"
          src={basket}
          height="40%"
          style={{ margin: "0 auto" }}
        /> */}

        {/* <img src="..." class="card-img-top" alt="..."> */}
        <div className="card-body">
          <h5 className="card-title">Basket of assorted items</h5>
          <hr />
          <div className="prices">
            <p>
              <span className="amountTxt">Asking Price :</span>{" "}
              <span className="amount">${asking}</span>{" "}
            </p>
            <p>
              <span className="amountTxt">Current User Offer :</span>{" "}
              <span className="amount">${UserOffer}</span>
            </p>
            <p>
              <span className="amountTxt">Current Counter Offer :</span>{" "}
              <span className="amount">${counterOffer}</span>
            </p>
          </div>

          {/* Refactor and make the below a component */}

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button onClick={OfferPrice} className="btn btn-primary">
              Make Offer
            </button>
            {/* <button onClick={handleBtnTitle} className="btn btn-primary">
              {btnTitle ? "Make Offer" : "Accept Offer"}
            </button> */}
            <input
              onKeyUp={changeUserOffer}
              type="text"
              required
              placeholder="Type your amount"
              style={{ width: "150px", height: "35px" }}
            />
            {/* <button className="btn btn-primary">Checkout</button> */}
          </div>
          <hr />
          <OfferCount
            count={Offercount}
            totalCount={TotalOfferCount}
            // entity={{
            //   first: "Monday",
            //   second: "Tuesday",
            //   third: "Wednesday",
            // }}
          />
        </div>
      </div>
    </>
  );
}

export default ProdImg;
