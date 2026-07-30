import os
import random

from flask import Flask, jsonify, request, send_from_directory

from _data import PORTFOLIO, REVIEWS, STATS

app = Flask(__name__)

# Project root, one level up from this file (api/index.py -> project root).
# Used only for local preview below; on Vercel, static files are served
# directly by the platform and never touch this Python function.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


@app.after_request
def add_headers(response):
    if request.path == "/api/portfolio":
        response.headers["Cache-Control"] = "no-store"
    else:
        response.headers["Cache-Control"] = "public, max-age=300"
    return response


@app.get("/api/stats")
def get_stats():
    return jsonify(STATS)


@app.get("/api/reviews")
def get_reviews():
    return jsonify(REVIEWS)


@app.get("/api/portfolio")
def get_portfolio():
    shuffled = PORTFOLIO.copy()
    random.shuffle(shuffled)
    return jsonify(shuffled)


# --- Local preview only ---------------------------------------------------
# These routes let you run just `python3 api/index.py` and open
# http://localhost:8000 to see the whole site, no Node/Vercel CLI needed.
# Port 8000, not 5000: on Mac, System Settings > AirPlay Receiver often
# already occupies port 5000, which silently breaks this exact setup.
# Only these specific folders are exposed, never the api/ folder itself,
# so _data.py and index.py source stay off-limits either way.


@app.get("/")
def index_page():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/robots.txt")
def robots_txt():
    return send_from_directory(BASE_DIR, "robots.txt")


@app.get("/sitemap.xml")
def sitemap_xml():
    return send_from_directory(BASE_DIR, "sitemap.xml")


@app.get("/css/<path:filename>")
def css_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "css"), filename)


@app.get("/js/<path:filename>")
def js_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "js"), filename)


@app.get("/assets/<path:filename>")
def asset_files(filename):
    return send_from_directory(os.path.join(BASE_DIR, "assets"), filename)


if __name__ == "__main__":
    app.run(debug=True, port=8000)
