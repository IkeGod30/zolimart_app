import "./ProductImg.css";
import basket from "../assets/voucher.jpg";

function ProdImg() {
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
          <h5 className="card-title">Voucher</h5>
          <div>
            <p>Asking Price: $100 </p>
            <p>Current Offer: $ </p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button onClick={""} className="btn btn-primary">
              Make Offer
            </button>
            <button className="btn btn-primary">Checkout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProdImg;
