import { useState } from "react";
import "./Blog.css";

export default function BlogText() {
  const msg = {
    text: "Working",
    text2: "Anthony",
    text3: "Izuogu",
  };

  const hello = {
    text: "Next Js",
    text2: "React Js",
    text3: "Django",
  };

  const hi = {}; //
  hi.text = "Html";
  hi.text2 = "Css";
  hi.text3 = "Bootstrap";

  const [message, setmessage] = useState();

  function SendMessage(e) {
    setmessage(e.target.value);
  }

  function changeObj() {
    // setmessage(hello.text2);

    setmessage((hello.text2 = "")); // Resets or clears

    // setmessage(fine);
    // setmessage(hi);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  //   function Reset() {
  //     setmessage((message.text = ""));
  //   }

  //   function onChng(e) {
  //     SendMessage(e);
  //   }
  return (
    <div className="blog">
      <h1>Enter Text</h1>
      <h4>{message}</h4>
      {/* {message.text}
      {message.text2}
      {message.text3} */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={SendMessage}
          placeholder="Please type your message"
        />
      </form>
      <button onClick={() => alert(message)} className="btn btn-primary btn2">
        Send Message
      </button>
      <button onClick={changeObj} className="btn btn-primary btn2">
        Reset
      </button>
    </div>
  );
}
