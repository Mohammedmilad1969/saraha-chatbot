python -m venv saraha_env
saraha_env\Scripts\activate



curl -X POST http://127.0.0.1:5000/chat -H "Content-Type: application/json" -d "{\"message\": \"Hello Saraha\"}"


