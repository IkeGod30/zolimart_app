// Component for Creating Product Detail Inputs/parameters //

export default function NewProduct() {
  const details = {
    description: "Computer",
    specs: "HP Laptop",
    quiz: "Follow Me",
    // pic: "../assets/voucher.jpg",
  };
  return (
    <div>
      <form>
        {/* <marquee>
          <label>{details.quiz}</label>
          <br />
          <label>{details.description}</label>
          <label>{details.pic}</label>
        </marquee> */}
      </form>
    </div>
  );
}
