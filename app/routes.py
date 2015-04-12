from flask import Flask, render_template, request
import helpers



app = Flask(__name__, static_url_path='')

# creates a dictionary to store request objects
app.vars = {}


@app.route('/', methods = ['GET'])
def index():
    return render_template('home.html')
    
@app.route('/orders', methods = ['GET', 'POST'])
def orders():
	if request.method == 'GET':

		return render_template('searchorders.html')
		
	else:


		# build the skiplist
		orderskiplist = helpers.makePresidentialOrderlist()

	
		if request.form['title_cont'] != '':
			app.vars['title_cont'] = request.form['title_cont']
		if request.form['category'] != '':
			app.vars['category'] = request.form['category']
	    
		if len(app.vars) == 1:

			searchtype = app.vars.keys()[0]
			
			filters.filter(orderskiplist, app.vars, searchtype, 'title', 2)

			# resets the request dictionary
			app.vars = {}
			return render_template('download.html')

		else:
			app.vars = {}
			return render_template('error.html')

		





if __name__ == '__main__':
    app.run(debug=True)	
