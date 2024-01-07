import "./OfferCount.css";
import { useState } from "react";

export default function OfferCount({ count, status }) {
  //   const [isValid, setisValid] = useState(false);

  //   function changeStatus() {
  //     setisValid(false);
  //   }

  //   if (isValid) {
  //     return <p onMouseOver={changeStatus}>It is Valid</p>;
  //   }

  //   return <h3 onClick={changeStatus}>Not Valid</h3>;
  return (
    <div>
      <h4 className="OfferCount-div">Offer Count : {count}</h4>
    </div>
  );
}
