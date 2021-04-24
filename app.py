from flask import Flask, request, jsonify, render_template
import pickle
import numpy as np
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS

app = Flask(__name__)
model = pickle.load(open('app_model.pkl', 'rb'))
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# @app.route('/home', methods = ['GET'])
# def home():
#     return render_template("dist/templates/index.html")

@app.route('/predictSalary', methods = ['POST'])
def postJsonHandler():
    print(request.is_json)
    content = request.get_json()
    print(content)
    salary = predict_salary(content['rating'], content['founded'], content['competitors'],
                            content['sector'], content['ownership'], content['job_title'],
                            content['job_seniority'], content['job_in_headquarters'], content['job_skills'])
    return jsonify({'min_salary': int(salary*1000)-9000,
                    'max_salary':int(salary*1000)+9000})

def predict_salary(rating, founded, competitors, sector, ownership, job_title, job_seniority, job_in_headquarters,
                   job_skills):
    sc_rating = StandardScaler()
    sc_founded = StandardScaler()
    prediction_input = list()
    prediction_input.append(sc_rating.fit_transform(np.array(rating).reshape(1, -1)))
    prediction_input.append(sc_founded.fit_transform(np.array(founded).reshape(1, -1)))
    prediction_input.append(competitors)

    sector_columns = ['sector_Business Services',
                      'sector_Information Technology', 'sector_Biotech & Pharmaceuticals']
    temp = list(map(int, np.zeros(shape=(1, len(sector_columns)))[0]))
    for i in range(0, len(sector_columns)):
        if sector_columns[i] == 'sector_' + sector:
            temp[i] = 1;
            break;
    # print(temp)
    prediction_input = prediction_input + temp

    if ownership == 'Private':
        prediction_input.append(1)
    else:
        prediction_input.append(0)

    if job_title == 'data scientist':
        prediction_input.append(1)
    else:
        prediction_input.append(0)

    job_seniority_map = {'other': 0, 'jr': 1, 'sr': 2}

    prediction_input.append(job_seniority_map[job_seniority])

    prediction_input.append(job_in_headquarters)

    temp = list(map(int, np.zeros(shape=(1, 4))[0]))
    if 'excel' in job_skills:
        temp[0] = 1
    if 'python' in job_skills:
        temp[1] = 1
    if 'tableau' in job_skills:
        temp[2] = 1
    if 'sql' in job_skills:
        temp[3] = 1

    prediction_input = prediction_input + temp

    # print(prediction_input)

    return model.predict([prediction_input])[0];

# print('Estimated salary {}'.format(round(salary, 2)))

if __name__ == '__main__':
    app.run(host='localhost', port=8081)