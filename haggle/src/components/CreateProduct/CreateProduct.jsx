// Component for Creating Product Detail Inputs/parameters //
import { useState } from "react";

export default function NewProduct() {
  // const details = {
  //   description: "Computer",
  //   specs: "HP Laptop",
  //   quiz: "Follow Me",
  // };
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
