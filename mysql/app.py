from flask import Flask, render_template, request, flash, redirect, url_for
from flask_mysqldb import MySQL
import MySQLdb.cursors
from dotenv import load_dotenv
import os

load_dotenv('.env')

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = os.getenv('SQL_PASSWORD')
app.config['MYSQL_DB'] = 'python'

mysql = MySQL(app)

@app.route('/', methods=['GET', 'POST'])
def display():
    display = []
    error = False
    if request.method == 'POST':
        if 'name' in request.form and 'quote' in request.form:
            speaker = request.form['name']
            quote = request.form['quote']
            return redirect(url_for('post', quote=quote, speaker=speaker))
        else:
            error = True
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('SELECT quote, speaker FROM quotes')
    rv = cursor.fetchall()
    return render_template('index.html',display=rv, error=error)


@app.route('/publish/<quote>/<speaker>')
def post(quote, speaker):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    cursor.execute('INSERT INTO quotes VALUES ( NULL, % s, % s)', (quote, speaker))
    mysql.connection.commit()
    return redirect(url_for('display'))


if __name__ == '__main__':
    app.run(debug=True)
