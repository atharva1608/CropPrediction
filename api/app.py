import numpy as np
import json
import pickle
import firebase_admin
from firebase_admin import credentials,firestore
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin

cd = credentials.Certificate("C:/Users/DELL/Downloads/smart-agriot-firebase-adminsdk-q0wwx-cf43245a33.json")
# In the above line <path_to_generated_private_key>
# is a placeholder for the generate JSON file containing
# your private key.
firebase_admin.initialize_app(cd)
datab = firestore.client()
usersref = datab.collection('market requirements')
docs = usersref.stream()
cropRequirements = {}

def lower_dict(d):
    new_dict = dict((k.lower(), v) for k, v in d.items())
    return new_dict

for doc in docs:
    cropRequirements = doc.to_dict()
cr = lower_dict(cropRequirements)
print(cr)

app = Flask(__name__)

cors = CORS(app)

# Load model from model.pkl
model = pickle.load(open('model.pkl', 'rb'))


# Homepage route
@app.route('/')
def home():
    response = "HELLO WORLD from SMART-AgrIoT"
    resp = {"ans" : response } 
    return jsonify(resp)

@app.route('/prediction',methods=["POST", "GET"])
def predict():
    '''
    For rendering results on HTML GUI
    '''
    try:
        

        if request.method == "POST":
             content_type = request.headers.get('Content-Type')
             print(content_type)
             if (content_type == 'application/json'):
                int_features = [float(x) for x in request.json.values()]  
                # int_features = [int(i) for i in int_features]   
                print(int_features)
                final_features = [np.array(int_features)]
                pred_proba = model.predict_proba(final_features)
                res = {}
                
                crops = {'apple': 0, 'banana': 1, 'blackgram': 2, 'chickpea': 3, 'coconut': 4, 'coffee': 5, 'cotton': 6, 'grapes': 7, 'jute': 8, 'kidneybeans': 9, 'lentil': 10, 'maize': 11, 'mango': 12, 'mothbeans': 13, 'mungbean': 14, 'muskmelon': 15, 'orange': 16, 'papaya': 17, 'pigeonpeas': 18, 'pomegranate': 19, 'rice': 20, 'watermelon': 21}
                
                keys = list(crops.keys())
                values = list(crops.values())
                for i in range(len(pred_proba[0])):
                    if(pred_proba[0][i]>0):
                        res[i] = pred_proba[0][i]

                keys1 = list(res.keys())
                values1 = list(res.values())
                sorted_value_index = np.argsort(values1)
                sorted_dict = {keys1[i]: values1[i] for i in sorted_value_index}
                print(sorted_dict)
                print("---------")
                sorted_dict = {keys[values.index(keys1[i])] : values1[i] for i in sorted_value_index}
                print(sorted_dict)
                final_op = {}
                for key in sorted_dict:
                    if key in cr:
                        final_op[key] = sorted_dict[key] * cr[key] 
                
                print(final_op)
                top_classes=[]
                for x in list(reversed(list(final_op))):
                    top_classes.append(x)
                print(top_classes) 
                print("Hey")
                response = jsonify({
                            "statusCode": 200,
                            "status": "Prediction made",
                            "result": top_classes[0]
                            })
                
                return {"result1": top_classes[0], "result2": top_classes[1], "result3": top_classes[2]}
            
             else : 
                print("400")
                return 'bad request!', 400  
    except:
        print("hELLO")
        return json.dumps({"error":"Please Enter Valid Data"})
    

if __name__ == "__main__":
    app.run()