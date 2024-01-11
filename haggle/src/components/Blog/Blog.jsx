import { useState } from "react";
import "./Blog.css";

export default function BlogText() {
  const msg = [
    {
      text: "Working",
      text2: "Anthony",
      text3: "Izuogu",
    },
  ];
  const [message, setmessage] = useState(msg);

  function SendMessage(e) {
    setmessage(e.target.value);
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
      {message.text}
      {message.text2}
      {message.text3}
      <form onSubmit={handleSubmit}>
        <textarea
          value={message.text}
          onChange={SendMessage}
          placeholder="Please type your message"
        />
      </form>
      <button onClick={() => alert(message)} className="btn btn-primary btn2">
        Send Message
      </button>
      {/* <button onClick={Reset} className="btn btn-primary btn2">
        Reset
      </button> */}
    </div>
  );
}
