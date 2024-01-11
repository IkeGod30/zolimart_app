import ProductComp from './components/Product/Product';
import './App.css';
import Toastalert from './components/Toast/Toast';
import BlogText from './components/Blog/Blog';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Zolimart</h1>

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
      <ProductComp />
      <ProductComp />
      
      {/* <Toastalert /> */}
      {/* <ProductComp />
      <ProductComp />
      <ProductComp /> */}
      </div>
<br /><br />

      <BlogText />
   
    </div>
  );
}

export default App;
