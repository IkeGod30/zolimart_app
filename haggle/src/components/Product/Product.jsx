import "./Product.css";
import ProdImg from "../ProductImage/ProductImage";
import BargainPrice from "../Bargain/Bargain";

function ProductComp() {
  return (
    <div>
      <h3 className="first">Template</h3>
      <ProdImg />
      {/* <BargainPrice /> */}
    </div>
  );
}

function OfferPrice(e) {
  let askingPrice = 800;
  let Offer = e.trarget.value;
  const LAST_PRICE = askingPrice * 0.15;
  // let Offered_price = e.target.value;

  if (Offer > 30) {
    alert("Congratulations! Your Offer has been accepted");
  } else {
    alert("Your offer is not accepted");
  }
}

function ValidateEntry() {
  const Offer = prompt("Please type in your price offer");
  if (Offer != null) {
    alert("Please type in a valid amount in dollars");
  }
}

export default ProductComp;
