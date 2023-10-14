from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import json

app = Flask(__name__)
app.secret_key = 'my_secret_key'

change_requests = []

# Function to load user data from user_data.json
def loaduser_data():
    with open('./static/data/user_data.json', 'r') as file:
        data = json.load(file)
        return data

# Route for the homepage, both GET and POST methods are supported
@app.route('/', methods=['GET', 'POST'])
def index():
    error = None

    if request.method == 'POST':
        userid = request.form['userid']
        passcode = request.form['passcode']

        data = loaduser_data()

        for user in data['user_data']:
            if userid == user['userid'] and passcode == user['passcode']:
                session['userid'] = userid
                return redirect(url_for('profile'))
            elif userid == "admin" and passcode == "admin":
                return render_template("admin.html", userid=userid, change_requests=change_requests)
            else:
                error = 'Invalid credentials. Please try again'

    return render_template('index.html', error=error)

# Function to get user details after login
def get_user_details(userid):
    data = loaduser_data()
    user_data_list = data.get("user_data", [])

    for user_data in user_data_list:
        if user_data.get("userid") == userid:
            return user_data

# Function to get the monthly current value for a specific work type
def get_monthly_current_value(userid, work_type):
    user_data = get_user_details(userid)

    for work in user_data.get("data", []):
        if work.get("work-type") == work_type:
            monthly_data = work["aggregates"].get("monthly", {})
            return monthly_data.get("current")

# Route for the user profile page
@app.route('/profile/')
def profile():
    userid = session.get('userid')
    user_details = get_user_details(userid)
    office = get_monthly_current_value(userid, "Office")
    support = get_monthly_current_value(userid, "Support")
    counter = get_monthly_current_value(userid, "Counter")

    return render_template('profile.html', user_details=user_details, office=office, support=support, counter=counter)

# Route for the admin page
@app.route('/admin/')
def admin():
    userid = session.get('userid')
    return render_template('admin.html', change_requests=change_requests)

# Route to save data (POST method)
@app.route('/save', methods=['POST'])
def save_data():
    try:
        edited_data = request.get_json()

        # Initialize the session 'temp_data' if it doesn't exist
        if 'temp_data' not in session:
            session['temp_data'] = {}

        # Store the edited_data in the session
        session['temp_data'] = edited_data

        print("Received edited data1:", edited_data)

        return jsonify({"message": "Data temporarily saved"})
    except Exception as e:
        return jsonify({"error": "An error occurred"})

# Route for the user dashboard
@app.route('/dashboard/', methods=['GET', 'POST'])
def dashboard():
    userid = session.get('userid')

    return render_template('dashboard.html', user_details=get_user_details(userid), userid=jsonify(userid))

# Route to get the userid
@app.route('/get_userid', methods=['GET', 'POST'])
def get_userid():

    # Check if 'temp_data' exists in the session and is not empty
    userid = session.get('userid')

    if edited_data:
        print("userid", userid)
    else:
        userid = {}
    return (jsonify(userid))

# Route to get edited data
@app.route('/edited_data', methods=['GET', 'POST'])
def edited_data():

    # Check if 'temp_data' exists in the session and is not empty
    edited_data = session.get('temp_data', {})

    if edited_data:
        print("Received edited dataghd:", edited_data)
    else:
        edited_data = {}

    return (jsonify(edited_data))

# Route to get user data for a specific userid
@app.route('/user-data/<userid>', methods=['GET'])
def user_data(userid):
    user_data = get_user_details(userid)

    if user_data:
        return jsonify(user_data)
    else:
        return jsonify({"error": "User not found"})

# Route for user logout
@app.route('/logout')
def logout():
    # Clear the session and redirect to the login page
    session.pop('userid', None)
    return redirect(url_for('index'))

# Route to review requests
@app.route('/reviewrequest')
def reviewrequest():
    return redirect(url_for('rrequest'))

# Route for the request page
@app.route('/requestpage/')
def rrequest():
    return render_template('requestpage.html', requests=change_requests)

# Route to handle request for changing user data
@app.route("/request_change", methods=["POST"])
def request_change():
    userid = session.get("userid")
    workType = request.form["workType"]
    change_requests.append({"userid": userid, "workType": workType})
    return redirect(url_for('rrequest'))

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=8080)
