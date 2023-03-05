import './App.css';
import React from 'react';
import StartFirebase from './Firebase';
import { ref, onValue } from 'firebase/database';
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

function App() {

const [postDataTemp, setPostDataTemp] = useState();
const [postDataHumi, setPostDataHumi] = useState();
const [postDataN, setPostDataN] = useState();
const [postDataP, setPostDataP] = useState();
const [postDataK, setPostDataK] = useState();
const db = StartFirebase();

useEffect(()=>{
 
  const dbReftemp = ref(db,'Temperature');
  const dbRefhumi = ref(db,'Humidity');
  const dbRefN = ref(db,'N');
  const dbRefP = ref(db,'P');
  const dbRefK = ref(db,'K');

  onValue(dbReftemp,(snapshot)=>{
    const temp = snapshot.val();
    setPostDataTemp(temp);
  });

  onValue(dbRefhumi,(snapshot)=>{
    const humi = snapshot.val();
    setPostDataHumi(humi);
  });

  onValue(dbRefN,(snapshot)=>{
    const Nval = snapshot.val();
    setPostDataN(Nval);
  });

  onValue(dbRefP,(snapshot)=>{
    const Pval = snapshot.val();
    setPostDataP(Pval);
  });

  onValue(dbRefK,(snapshot)=>{
    const Kval = snapshot.val();
    setPostDataK(Kval);
  });

},[]);


const [formData, setFormData] = useState({
  N:postDataN,
  P:postDataP,
  K:postDataK,
  Temperature:postDataTemp,
  Humidity:postDataHumi,
  ph:"",
  rainfall:"",

});
const [result1, setResult1] = useState("");
const [result2, setResult2] = useState("");
const [result3, setResult3] = useState("");

const handleChange = (event) => {
  const value = event.target.value;
  const name = event.target.name;
  let inputData = {...formData};
  inputData[name]=value;
  setFormData(inputData);
}

const handlePredictClick = (event) => {
  
  const FORMDATA={
    N: postDataN,
    P:postDataP,
    K:postDataK,
    Temperature:postDataTemp,
    Humidity:postDataHumi,
    ph:formData.ph,
    rainfall:formData.rainfall
  }
  const config = {
  headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
  }
  axios.post("http://127.0.0.1:5000/prediction",FORMDATA,config)
  .then((response) => {
    setResult1(response.data.result1)
    setResult2(response.data.result2)
    setResult3(response.data.result3)
  }, (error) => {
    console.log(error);
  });

}

  

  return (
    <div className="App">
      <header className="App-header">
      {/* <div style="text-align:center;"><h1 style="color:darkgreen; font-size: xx-large;" ><u>Good Harvest</u> </h1>
<h3 style="color: brown; font-size: x-large;"><span>AgriBusiness Consulting in Crop Prediction and Smart Farming Agriculture Techniques company</span></h3>
</div> */}

      <p><h1><u>CROP PREDICTION SYSTEM</u></h1></p>
        <form method="POST">

        <p id="labelText">
        <label>N</label>
        <p type="text" name="N" id="N" value={formData.postDataN}>{postDataN}</p>
        </p>

        <p id="labelText">
        <label>P</label>
        <p type="text" name="P" id="P" value={formData.postDataP}>{postDataP}</p>
            
        </p>

        <p id="labelText">
        <label>K</label>
        <p type="text" name="K" id="K" value={formData.postDataK}>{postDataK}</p>
            
        </p>

        <p id="labelText">
        <label>temperature</label>
            <p type="text" name="Temperature" id="temp" value={formData.postDataTemp}>{postDataTemp}</p>
            
    </p>
    
    <p id="labelText">
    <label>humidity</label>
        <p type="text" name="Humidity" id="humi" value={formData.postDataHumi}>{postDataHumi}</p>
        
    </p>

    <p id="labelText">
        <label>ph</label>
            <input type="text" name="ph" id="ph" value={formData.ph} onChange={handleChange}/>
            
        </p>

    <p id="labelText">
        <label>rainfall</label>
        <input type="text" name="rainfall" value={formData.rainfall} onChange={handleChange}/>
       
        </p>
        
       <Link to='/'> <input type="submit" onClick={handlePredictClick}/> </Link>
            <br/>
   <br/>
   {/* <h1 color="white" size="5">{{ prediction_text }}</h1> */}
        </form>
        {result1 === "" ? null :
                (<div>
                    <p className="result-container">
                        <h5 id="result">{result1}</h5>
                    </p>
                </div>)
            }
            {result2 === "" ? null :
                (<div>
                    <p className="result-container">
                        <h5 id="result">{result2}</h5>
                    </p>
                </div>)
            }
            {result3 === "" ? null :
                (<div>
                    <p className="result-container">
                        <h5 id="result">{result3}</h5>
                    </p>
                </div>)
            }
      </header>
      
      


    </div>

    
  );
  
  
}

export default App;
