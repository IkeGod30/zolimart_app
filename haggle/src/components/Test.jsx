import { useReducer } from "react";

function Testing() {
  const [data, dispatch] = useReducer(dataReducer, inf);

  function changeData() {
    dispatch({
      type: "changed",
    });
  }

  function changeT() {
    dispatch({
      type: "changeTwo",
    });
  }

  function changeTh() {
    dispatch({
      type: "changeThree",
    });
  }

  return (
    <div>
      <button onClick={changeData}>One...</button>
      <br />
      <br />
      {/* <button
        onClick={() => {
          setdat({ day: "sun", inc: 850 });
        }} */}
      <button onClick={changeT}>Two...</button>
      <br />
      <br />
      {/* <button
        onClick={() => {
          setdat({ day: "sat", inc: 1500 });
        }}
      > */}
      <button onClick={changeTh}>Three...</button> <br />
      <br />
      <div>
        <h3 style={{ color: "orange" }}>{data.day}</h3> <br />
        <h3 style={{ color: "blue" }}>{data.inc}</h3> <br />
        <h3 style={{ color: "green" }}>{data.status}</h3>
      </div>
    </div>
  );
}

function dataReducer(data, action) {
  switch (action.type) {
    case "changed": {
      //   return { day: "Thursday", inc: 1500, status: "N/A" };
      return { ...data, inc: 1500, status: "N/A" };
    }
    case "changeTwo": {
      return { day: "Friday", inc: 2000, status: "OFF" };
    }
    case "changeThree": {
      return { day: "Saturday", inc: 2500, status: "ON" };
    }
    default:
      return inf;
  }
}

const inf = [
  { day: "mon", inc: 80, status: "out" },
  //   { day: "tues", inc: 90 },
  //   { day: "wed", inc: 101 },
  //   { day: "thur", inc: 112 },
  //   { day: "fri", inc: 121 },
  //   { day: "sat", inc: 141 },
  //   { day: "sun", inc: 148 },
];

export default Testing;
