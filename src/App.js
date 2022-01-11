import './App.css';
import {Header, Main} from './components';


const sampleData = {
    question: "What is your name?",
    options: [
        "Naveen",
        "SK",
        "SK Naveen",
        "Naveen SK"
    ]
};

function App() {
  return (
      <div className="d-flex flex-column h-100">
        <Header/>
        <Main data={sampleData}/>
      </div>
  );
}

export default App;
