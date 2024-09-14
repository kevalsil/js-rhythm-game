from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)  # CORS 활성화

# 데이터베이스 초기화
def init_db():
    conn = sqlite3.connect('leaderboard.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS rankings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            score INTEGER NOT NULL,
            combo INTEGER NOT NULL,
            accuracy REAL NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# 점수 제출 API
@app.route('/submit-score', methods=['POST'])
def submit_score():
    data = request.json
    conn = sqlite3.connect('leaderboard.db')
    c = conn.cursor()
    c.execute('INSERT INTO rankings (name, score, combo, accuracy) VALUES (?, ?, ?, ?)',
              (data['name'], data['score'], data['combo'], data['accuracy']))
    conn.commit()
    conn.close()
    return 'Score submitted!', 200

# 랭킹 조회 API
@app.route('/rankings', methods=['GET'])
def get_rankings():
    conn = sqlite3.connect('leaderboard.db')
    c = conn.cursor()
    c.execute('SELECT name, score, combo, accuracy FROM rankings ORDER BY score DESC LIMIT 10')
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
