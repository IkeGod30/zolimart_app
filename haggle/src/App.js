import Testing from "./components/Test"; // Code Test and REMOVE
import Exp from "./components/Experiment";

import Drawer from './components/Navigation/Drawer'

import ProductComp from './components/Product/Product';
import CircularIndeterminate from "./components/Progress"; // MUI component
import './App.css';
import BlogText from './components/Blog/Blog';
import NewProduct from './components/CreateProduct/CreateProduct';

function App() {
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
