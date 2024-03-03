import { useState } from "react";
import { useReducer } from "react";

function Testing() {
  //   const [dat, setdat] = useState([]);
  const [data, dispatch] = useReducer(dataReducer, []);

  function changeData() {
    dispatch({
      type: "changed",
    });
  }

  //   function dataReducer(data, action) {
  //     if (action.type === "changed") {
  //       return { day: "Thursday", inc: 1500 };
  //     }
  //   }

  //   function changeDat() {
  //     setdat({ day: "fri", inc: 501 });

  // setdat(
  //   dat.map((d) => {
  //     return <li>{d}</li>;
  //   })
  // );
  //}
  return (
    <div>
      <button onClick={changeData}>One...</button>
      <br />
      <br />
      {/* <button
        onClick={() => {
          setdat({ day: "sun", inc: 850 });
        }} */}
      <button onClick={changeData}>Two...</button>
      <br />
      <br />
      {/* <button
        onClick={() => {
          setdat({ day: "sat", inc: 1500 });
        }}
      > */}
      <button onClick={changeData}>Three...</button> <br />
      <br />
      <div>
        <h3>{data.day}</h3> <br />
        <h3>{data.inc}</h3> <br />
        {/* <h3>{dat.sat}</h3> */}
      </div>
    </div>
  );
}

function dataReducer(data, action) {
  switch (action.type) {
    case "changed":
      return { day: "Thursday", inc: 1500 };
  }
}

const inf = [
  { day: "mon", inc: 80 },
  //   { day: "tues", inc: 90 },
  //   { day: "wed", inc: 101 },
  //   { day: "thur", inc: 112 },
  //   { day: "fri", inc: 121 },
  //   { day: "sat", inc: 141 },
  //   { day: "sun", inc: 148 },
];

export default Testing;
