import "./ProductImg.css";
import basket from "../assets/voucher.jpg";
import { useState } from "react";
import Toastalert from "../Toast/Toast";

function ProdImg() {
  const [counterOff, setcounterOff] = useState(0);
  const [offersubmit, setoffersubmit] = useState(0);
  const [UserOffer, setUserOffer] = useState(0);
  const [counterOffer, setcounterOffer] = useState();

  // const [offerPercent, setofferPercent ] = useState();

  // function changeOfferPercent() {
  //   setofferPercent()
  // }

  function changeUserOffer(e) {
    setUserOffer(e.target.value);
  }

  function changeCounterOffer(offerPercent) {
    // Check !!! //
    setcounterOffer(offerPercent); // Set  argument with state also
    // <Toastalert />;
  }

  // function offerChange() {
  //   setoffersubmit(submitOffer);
  // }

  const asking = 45;
  let Offer = UserOffer;
  const DiscountTen = asking * 0.1;
  const DiscountFive = asking * 0.05;
  const DiscountTwenty = asking * 0.2;

  const OfferTen = asking - DiscountTen;
  const OfferFive = asking - DiscountFive;
  const OfferTwenty = asking - DiscountTwenty;

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

    if (Offer < asking - asking * 0.3 && Offer != asking) {
      // 31.5
      // alert("I'm making counter of..." + OfferTen);
      // alert(asking - asking * 0.3);
      // <Toastalert />;

      changeCounterOffer(OfferTen);
      // alert("Congratulations! Your Offer has been accepted");
    } else if (Offer > asking - asking * 0.35 && Offer != asking) {
      // 29.25
      // alert("I'm making counter of..." + OfferFive);
      // <Toastalert />;
      changeCounterOffer(OfferFive);
    } else if (Offer > asking - asking * 0.4 && Offer != asking) {
      // 27
      // alert("My counter is..." + OfferTwenty);
      // <Toastalert />;
      changeCounterOffer(OfferTwenty);
    }

    if (Offer == asking) {
      alert("Your Offer matches the asking price.");
      changeCounterOffer(asking);
    } else if (Offer > asking) {
      alert(
        "Your offer is above the Asking Price. Please make an offer equal or below the Asking Price"
      );

      changeCounterOffer(asking);
    }

    // if (typeof Offer != number) {
    //   alert("Your input must be a valid number");
    // }
  }

  //   if (Offer >= asking) {
  //     alert("Congratulations! Your Offer has been accepted");
  //   } else {
  //     alert("I'm making counter of..." + OfferTen);
  //   }
  // }

  function submitOffer(e) {
    //  e.target.value; // To be used in logic
  }

  return (
    <>
      <div
        className="card"
        style={{
          width: "18rem",
          height: "373px",
          margin: "0 auto",
          borderRadius: "5px",
          border: "solid gray 1px",
        }}
      >
        <img
          width="221"
          src={basket}
          style={{ margin: "0 auto", marginTop: "10px" }}
        />
        {/* <img src="..." class="card-img-top" alt="..."> */}
        <div className="card-body">
          <h5 className="card-title">Basket of assorted items</h5>
          <div className="prices">
            <p>
              Asking Price: <b>$</b>
              {asking}{" "}
            </p>
            <p>
              Current User Offer: <b>$</b>
              {UserOffer}
            </p>
            <p>
              Current Counter Offer: <b>$</b>
              {counterOffer}
            </p>
            {/* <p>Counter Offer: $ {counterOffer}</p> */}
          </div>

          {/* Refactor and make the below a component */}

          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button
              onClick={OfferPrice}
              // onFocus={<Toastalert />}
              className="btn btn-primary"
            >
              Make Offer
            </button>
            <input
              onKeyUp={changeUserOffer}
              type="text"
              required
              placeholder="Type your amount"
              style={{ width: "100px", height: "35px" }}
            />
            {/* <button className="btn btn-primary">Checkout</button> */}
          </div>
        </div>
      </div>
      {/* <Toastalert /> */}
    </>
  );
}

export default ProdImg;
