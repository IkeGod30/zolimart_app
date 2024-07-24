import Testing from "./components/Test.jsx"; // Code Test and REMOVE
import Exp from "./components/Experiment.jsx";

import Drawer from './components/Navigation/Drawer.jsx'

import ProductComp from './components/Product/Product.jsx';
import CircularIndeterminate from "./components/Progress.jsx"; // MUI component
import './App.css';
import BlogText from './components/Blog/Blog.jsx';
import NewProduct from './components/CreateProduct/CreateProduct.jsx';

const App = ()=> {
  return (
    <div className="App">
      {/* <h1>Welcome to ZoliMart</h1> */}
      {/* <h2>The Bargain App</h2> */}
      <Drawer />
      {/* <CircularIndeterminate /> */}

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
      <ProductComp />
      <ProductComp />
      {/* <NewProduct /> */}
      
     
      {/* <ProductComp /> */}
      {/* <ProductComp /> */}
      </div>
<br /><br />

      {/* <BlogText /> */}

      {/* <Testing /> */}
      {/* <Exp /> */}
   
    </div>
  );
}

export default App;
