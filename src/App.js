import './App.css';
import OtpInput from './OtpInput.tsx';

function App() {
  return (
    <div className="App">
      <OtpInput onSubmit = {(otp) => console.log(otp)} />
    </div>
  );
}

export default App;
