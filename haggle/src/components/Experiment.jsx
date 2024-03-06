import { useReducer } from "react";

export default function Exp() {
  const [info, dispatch] = useReducer(infoReducer, record);

  function tryIt() {
    dispatch({
      type: record,
    });
  }

  return (
    <div>
      <button onClick={tryIt}>Activate</button>
      <h2>{info.id}</h2>;
    </div>
  );
}

function infoReducer(info, action) {
  switch (action.type) {
    case record.id: {
      return { id: "six", ind: "sept", item: "vin" };
    }
  }
}
const record = { id: "un", ind: "duo", item: "troi" };
