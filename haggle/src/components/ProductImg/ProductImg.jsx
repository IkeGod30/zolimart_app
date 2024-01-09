import "./ProductImg.css";
import basket from "../assets/voucher.jpg";

export default function ProductImg() {
  return (
    <img
      width="100%"
      src={basket}
      height="40%"
      alt="A basket"
      // style={{ margin: "0 auto" }}
    />
  );
}
