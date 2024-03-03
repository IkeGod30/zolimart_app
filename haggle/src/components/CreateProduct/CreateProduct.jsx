// Component for Creating Product Detail Inputs/parameters //
import { useState } from "react";
import { useReducer } from "react"; // Use instead of useState

export default function NewProduct() {
  // const details = {
  //   description: "Computer",
  //   specs: "HP Laptop",
  //   quiz: "Follow Me",
  // };

  const [speci, dispatch] = useReducer(specsReducer, {}); // -- 1 -- //

  function createProduct() {
    // -- 2 -- //
    dispatch({
      type: "addedProduct",
    });
  }

  function specsReducer(speci, action) {
    // -- 3 -- //
    if (action.type == "addedProduct") {
      return {
        ...speci,
        description: "Iphone",
        specs: "15 proMax",
        quiz: "Things Fall Apart",
      };
    }
  }

  const [specify, setSpecify] = useState({
    description: "Computer",
    specs: "HP Laptop",
    quiz: "Follow Me",
  });
  function changeSpecs() {
    setSpecify({
      ...specify,
      specs: "Saints In Hell",
      quiz: "Merchant of Venice",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>{specify.quiz}</label>
        <br />
        <label>{specify.description}</label>
        <br />
        <label>{specify.specs}</label>
        <br />

        <button onClick={changeSpecs}>Change Specs</button>
      </form>
    </div>
  );
}
