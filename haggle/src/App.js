import ProductComp from './components/Product/Product';
import './App.css';
import BlogText from './components/Blog/Blog';
import NewProduct from './components/CreateProduct/CreateProduct';

function App() {
  return (
    <div className="App">
      <h1>Welcome to ZoliMart</h1>
      <h2>Let's Bargain</h2>

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
      <ProductComp />
      <ProductComp />
      {/* <NewProduct /> */}
      
     
      {/* <ProductComp />
      <ProductComp />
      <ProductComp /> */}
      </div>
<br /><br />

      {/* <BlogText /> */}
   
    </div>
  );
}

export default App;
