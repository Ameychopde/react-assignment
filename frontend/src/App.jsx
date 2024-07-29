import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import CustForm from "./components/CustForm";
import CustList from "./components/CustList";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      
      <CustList />
    </>
  );
}

export default App;
