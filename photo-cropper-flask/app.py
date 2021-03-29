from flask import Flask, render_template, request
from PIL import Image
from io import BytesIO
import base64
import os

app = Flask(__name__)

@app.route('/')
def upload_f():
   return render_template('index.html')

@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
   if request.method == 'POST':
      posX = int(request.form['posX'])
      posY = int(request.form['posY'])
      width = int(request.form['width'])
      height = int(request.form['height'])

      # gets file uploaded in the form
      f = request.files['file']

      # converts file to an Image
      im = Image.open(f)

      # adjusts the height to the fixed display height from index.html to ensure
      # the crop is correct
      baseheight = 300
      hpercent = (baseheight/float(im.size[1]))
      wsize = int((float(im.size[0])*float(hpercent)))
      im = im.resize((wsize,baseheight), Image.ANTIALIAS)

      # finds the left, top, right, and bottom to crop off
      left = posX
      top = posY
      right = width + left
      bottom = height + top

      # crops the image
      im1 = im.crop((left, top, right, bottom))

      # base64 image encoding
      data = BytesIO()
      im1.convert('RGB').save(data, "JPEG")
      data64 = base64.b64encode(data.getvalue())

      return render_template('cropped.html', image=u'data:img/jpeg;base64,'+data64.decode('utf-8'))

# if __name__ == '__main__':
app.run(debug = True)
