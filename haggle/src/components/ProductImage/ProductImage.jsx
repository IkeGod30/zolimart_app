import "./ProductImg.css";
import { useState } from "react";
import { useReducer } from "react"; // Use for Reducer function in place of useState
// import Toastalert from "../Toast/Toast";
import OfferCount from "../OfferCount/OfferCount";
import ProductImg from "../ProductImg/ProductImg";
import NewProduct from "../CreateProduct/CreateProduct";

function ProdImg() {
  // const [counterOff, setcounterOff] = useState(0);
  // const [offersubmit, setoffersubmit] = useState(0);
  const [UserOffer, setUserOffer] = useState(0);
  const [counterOffer, setcounterOffer] = useState();

  // const [disco, setdisco] = useState(discounts);
  /////// const [Offercount, setOffercount] = useState(0); //////

  const [btnTitle, setbtnTitle] = useState(true);

  const [Offercount, dispatch] = useReducer(offerReducer, 0); // -- 1 -- //

  // const NumberOfDiscounts = [];

  // const discounts = [
  //   { ind: 0, disc: OfferFive },
  //   { ind: 1, disc: OfferTen },
  //   { ind: 2, disc: OfferTwenty },
  //   { ind: 3, disc: OfferThirty },
  //   { ind: 4, disc: OfferForty },
  // ];
  const TotalOfferCount = 5;

  function changeOffercount() {
    // -- 2 -- //
    dispatch({
      type: "changedOffer",
    });
  }

  function offerReducer(Offercount, action) {
    // -- 3 -- //
    switch (action.type) {
      case "changedOffer": {
        return Offercount + 1;
      }
    }
  }

  // function changeOffercount() {
  //   setOffercount(Offercount + 1);
  // }

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
  }

  function changeCounterOffer(offerPercent) {
    // Check !!! //
    setcounterOffer(offerPercent); // Set argument with state also
    // setTimeout(() => {
    //   setcounterOff(offerPercent);
    // }, 5000);
  }

  function changeDisco(disc) {
    // Use map to handle the array
    // setdisco([...disco, { disc: OfferFive }]);
  }
  // function offerChange() {
  //   setoffersubmit(submitOffer);
  // }

  const asking = 45; // Refactor in state
  let Offer = UserOffer;
  const DiscountFive = (asking / 100) * 5; // 2.25
  const DiscountTen = (asking / 100) * 10; // 4.5
  const DiscountTwenty = (asking / 100) * 20; // 9
  const DiscountThirty = (asking / 100) * 30; // 13.5 // Unused
  const DiscountForty = (asking / 100) * 40; // 18  //Unused

  const OfferFive = asking - DiscountFive; // 42.75
  const OfferTen = asking - DiscountTen; // 40.5
  const OfferTwenty = asking - DiscountTwenty; // 36
  const OfferThirty = asking - DiscountThirty; // 31.5 // Unused
  const OfferForty = asking - DiscountForty; // 27  // Unused

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
    if (Offer < asking - DiscountFive && Offer !== asking) {
      // setcounterOffer(OfferFive);
      changeCounterOffer(OfferFive);
      changeOffercount();
    } else if (Offer < asking - DiscountTen && Offer !== asking) {
      // setcounterOffer(OfferTen);
      changeCounterOffer(OfferTen);
      changeOffercount();

      /// #### Used to delay the above code execution #####

      // setTimeout(() => {
      //   changeCounterOffer(OfferTen);
      //   changeOffercount();
      // }, 5000);

      // alert("Congratulations! Your Offer has been accepted");
    } else if (Offer > asking - DiscountTwenty && Offer !== asking) {
      // Check figure

      changeCounterOffer(OfferTwenty);
      changeOffercount();
    } else if (Offer > asking - DiscountThirty && Offer !== asking) {
      changeCounterOffer(OfferThirty);
      changeOffercount();
    } else if (Offer > asking - DiscountForty && Offer !== asking) {
      // Check figure
      changeCounterOffer(OfferForty);
      changeOffercount();
    }

    if (Offer == asking) {
      alert("Your Offer matches the asking price.");
      changeCounterOffer(asking);
      changeOffercount();
      changeOffercount();
      // setOffercount(Offercount); ///////
    } else if (Offer > asking) {
      alert(
        "Your offer is above the Asking Price. Please make an offer equal or below the Asking Price"
      );

      changeCounterOffer(asking);
      changeOffercount();
      // setOffercount(Offercount); /////////
    }

    if (Offer <= 0) {
      // You could also use the While statement
      alert("Offer cannot be zero or less than zero");
      changeCounterOffer(null);
      changeOffercount();
      // setOffercount(Offercount); /////
      setUserOffer(0);
    }
  }

  if (Offercount > TotalOfferCount) {
    // alert("You have reached the maximum number of offer");
    return (
      <div>
        <h4 style={{ color: "red" }}>Limit Exceeded</h4>
        <button className="btn btn-info" onClick={""}>
          Restart Bargain
        </button>
      </div>
    );
    // setOffercount(OfferCount);
  }

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
          <OfferCount count={Offercount} totalCount={TotalOfferCount} />
          {/* <OfferCount count={changeOffercount} totalCount={TotalOfferCount} /> */}
        </div>
      </div>
    </>
  );
}

export default ProdImg;
