import { useReducer } from "react";

// class People {
//   constructor(race, country) {
//     this.race = race
//     this.country = country
//   }
  
// }

// const Linda = new People("Black", "Nigeria")

// console.log(Linda.race, Linda.country)

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

export default Testing;

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
  { day: "mon", inc: 184, status: "out" },
  { day: "tue", inc: 122.52, status: "in" },
  { day: "wed", inc: 49.51, status: "N/A" },
  { day: "thur", inc: 123, status: "out" },
  { day: "fri", inc: 141.75, status: "in" },
  { day: "sat", inc: 141, status: "out" },
  { day: "sun", inc: 148, status: "N/A" },
];
