import { useState } from "react";

function Testing() {
  const [dat, setdat] = useState(inf);

  function changeDat() {
    setdat([...dat, { day: "fri", inc: 501 }]);

    // setdat(
    //   dat.map((d) => {
    //     return <li>{d}</li>;
    //   })
    // );
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
        <h3>{dat.day}</h3> <br />
        <h3>{dat.inc}</h3> <br />
        {/* <h3>{dat.sat}</h3> */}
      </div>
    </div>
  );
}

const inf = [
  { day: "mon", inc: 80 },
  { day: "tues", inc: 90 },
  { day: "wed", inc: 101 },
  { day: "thur", inc: 112 },
  { day: "fri", inc: 121 },
  { day: "sat", inc: 141 },
  { day: "sun", inc: 148 },
];

export default Testing;
