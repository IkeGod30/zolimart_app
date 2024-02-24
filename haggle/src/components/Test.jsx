import { useState } from "react";

function Testing() {
  const [dat, setdate] = useState([]);

  function changeDat() {
    setdate(...dat, { mon: 250, tues: 300, sat: 450 });
  }
  return (
    <div>
      <button onClick={changeDat}>One...</button>
      <br />
      <br />
      <button>Two...</button>
      <br />
      <br />
      <button>Three...</button> <br />
      <br />
      <div>
        <h3>{dat.mon}</h3> <br />
        <h3>{dat.tues}</h3> <br />
        <h3>{dat.sat}</h3>
      </div>
    </div>
  );
}

const inf = [
  { mon: 80 },
  { tues: 90 },
  { wed: 97 },
  { thur: 81 },
  { fri: 135 },
  { sat: 85 },
  { sun: 139 },
];

export default Testing;
