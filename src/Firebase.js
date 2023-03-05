import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database";


function StartFirebase(){
    const firebaseConfig = {
        apiKeain: "smart-agriot.firebaseapp.com",
        databasy: "AIzaSyCb-ZCOOAdIDxyEN_sFCB7QodeCaEQtZVo",
        authDomeURL: "https://smart-agriot-default-rtdb.firebaseio.com",
        projectId: "smart-agriot",
        storageBucket: "smart-agriot.appspot.com",
        messagingSenderId: "776397938423",
        appId: "1:776397938423:web:b701203f21b73364c87df2",
        measurementId: "G-Z4NW353K8H"
    };
    
    const app = initializeApp(firebaseConfig);
    return getDatabase(app);
}


export default StartFirebase;

