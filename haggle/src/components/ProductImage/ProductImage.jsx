import "./ProductImg.css";
import basket from "../assets/voucher.jpg";
import { useState } from "react";

function ProdImg() {
  const [counterOff, setcounterOff] = useState(0);
  const [offersubmit, setoffersubmit] = useState(0);

  function offerChange() {
    setoffersubmit(submitOffer);
  }

  const asking = 45;
  let Offer = 42; // Use State??
  const OfferTen = asking * 0.1;
  const OfferFive = asking * 0.05;
  const OfferTwenty = asking * 0.2;

  let counterOffer = null;
  // function prom() {
  //   prompt("Please type in your offer");
  // }

  function changeOffer() {
    setcounterOff(asking * 0.4);
  }

  function OfferPrice(e) {
    // const Offer = 0;
    // let Offer = e.trarget.value;
    // const LAST_PRICE = askingPrice * 0.15;
    // let Offered_price = e.target.value;

    if (Offer >= asking - OfferTen) {
      // let counterOffer = asking * 0.5;
      alert(asking - OfferTen);
      alert("Congratulations! Your Offer has been accepted");
      // counterOffer = asking * 0.6;
    } else {
      alert("Your offer is not accepted");
    }
  }

  function submitOffer(e) {
    //  e.target.value;
  }

  return (
    <>
      <div
        className="card"
        style={{
          width: "18rem",
          height: "350px",
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
          <h5 className="card-title">Shopping Voucher</h5>
          <div>
            <p>Asking Price: ${asking} </p>
            <p>Current Offer: $ {Offer}</p>
            {/* <p>Counter Offer: $ {counterOffer}</p> */}
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button onClick={OfferPrice} className="btn btn-primary">
              Make Offer
            </button>
            <input
              onKeyChange={submitOffer}
              type="text"
              placeholder="Type your amount"
              style={{ width: "100px", height: "35px" }}
            />
            {/* <button className="btn btn-primary">Checkout</button> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProdImg;
