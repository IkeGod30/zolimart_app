import ProductComp from './components/Product/Product';
import './App.css';
import Toastalert from './components/Toast/Toast';

function App() {
  return (
    <div className="App">
      <h1>Welcome to Zolimart</h1>

      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
      <ProductComp />
      {/* <Toastalert /> */}
      {/* <ProductComp />
      <ProductComp />
      <ProductComp /> */}
      </div>
   
    </div>
  );
}

export default App;
