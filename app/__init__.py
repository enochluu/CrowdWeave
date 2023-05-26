from flask import Flask

from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("secret_key")
# flask_app.config['CORS_HEADERS'] = 'Content-Type'

from app import routes

