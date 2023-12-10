import "./Bargain.css";

function BargainPrice() {
  return (
    <div className="bargain-div">
      <div className="asking">
        <p>Product Asking Price: $50</p>
      </div>
      <div className="offered">
        <p>Your Current Offered Price: $25</p>
      </div>
      <div className="offer-input">
        <button className="btn1" onClick={""}>
          Make an Offer
        </button>
        <input onChange={""} className="offer_price" />
      </div>
    </div>
  );
}

export default BargainPrice;
