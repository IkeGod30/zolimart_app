import "./OfferCount.css";
import { useState } from "react";

export default function OfferCount({ count, status, totalCount, entity }) {
  const TotalOfferCount = 4; //
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
      <h4 className="OfferCount-div">
        Offer Count : {count} of {totalCount}
      </h4>
      {/* <h3>
        {entity.first + " " + entity.second} {entity.length}
      </h3> */}
    </div>
  );
}
