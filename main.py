from flask import Flask, render_template, request
import helpers



app = Flask(__name__, static_url_path='')

# creates a dictionary to store request objects
app.vars = {}


@app.route('/', methods = ['GET'])
def index():
    return render_template('home.html')
    
@app.route('/visualization', methods = ['GET'])
def orders():
	return render_template('visualization.html')

		
if __name__ == '__main__':
    app.run(debug=True)	
