from flask import Flask
from flask import jsonify
from flask import send_from_directory
import pathlib

rootPath = str(pathlib.Path(__file__).absolute().parent.parent.parent.absolute())
cssPath = str(pathlib.PurePath(rootPath).joinpath("css"))
jsPath = str(pathlib.PurePath(rootPath).joinpath("javascript"))
fontsPath = str(pathlib.PurePath(rootPath).joinpath("webfonts"))

app = Flask(__name__, static_folder=rootPath)

@app.route("/", methods = ["GET"])
def main_route():
    return app.send_static_file('index.html')

@app.route("/css/<path:path>", methods = ["GET"])
def css(path):
    return send_from_directory(cssPath, path)

@app.route("/javascript/<path:path>", methods = ["GET"])
def js(path):
    return send_from_directory(jsPath, path)

@app.route("/webfonts/<path:path>", methods = ["GET"])
def webfonts(path):
    return send_from_directory(fontsPath, path)

if __name__ == "__main__":
    print(f'Root Path {rootPath}, JS PATH {jsPath}, CSS PATH {cssPath}, WEBFONTS PATH {fontsPath}')
    app.run("127.0.0.1", port=3333)
