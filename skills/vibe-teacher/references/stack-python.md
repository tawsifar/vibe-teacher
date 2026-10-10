# Stack pack: Python (Flask, FastAPI, Django, Streamlit)

## Python (5 lines)

> **Python** is a readable programming language; the **Python interpreter** is the engine that runs it.
> Your app starts with a command like `python app.py`, `flask run`, `uvicorn main:app` or `python manage.py runserver`.
> **pip** installs packages; `requirements.txt` (or `pyproject.toml`) is the shopping list.
> A **virtual environment** (`venv`) is a private package box so projects don't clash.
> Indentation (spaces at the start of lines) is part of the code's meaning.

## Flask

> A small, flexible web framework. You attach functions to addresses with `@app.route('/path')`.

| Path | Job |
|---|---|
| `app.py` | Creates the app and its routes |
| `templates/` | HTML pages with `{{ placeholders }}` (Jinja) |
| `static/` | CSS, JS, images |
| `blueprints/` or `routes/` | Groups of routes in bigger apps |

## FastAPI

> A modern framework for APIs. Routes look like `@app.get('/items')`, and **Pydantic** models
> check incoming data automatically. Free interactive docs at `/docs`. Run with `uvicorn main:app --reload`.

## Django

> A "batteries included" framework: database ORM, admin panel, login, forms, all built in.

| Path | Job |
|---|---|
| `manage.py` | The control panel command (`runserver`, `migrate`) |
| `project/settings.py` | All settings (database, installed apps, `DEBUG`, `SECRET_KEY`) |
| `project/urls.py` | The address book: URL → view |
| `app/views.py` | Functions that answer requests |
| `app/models.py` | Database tables as Python classes |
| `app/templates/` | HTML pages |
| `migrations/` | Tracked database changes |

## Streamlit

> Turns a Python script into a web app. Each interaction re-runs the script top to bottom.
> Secrets belong in `.streamlit/secrets.toml` (git-ignored), read with `st.secrets`.

## How a request flows (Flask/FastAPI)

```
Browser --POST /login--> @app.post('/login') / @app.route('/login', methods=['POST'])
                     --> function checks data, talks to the database
                     <-- return {"ok": True}  /  jsonify(...)  (status 200)
```

## Common beginner mistakes

| Mistake | Why it hurts | Fix idea |
|---|---|---|
| `SECRET_KEY` / API keys in `settings.py` or `app.py` | Leaks on GitHub | `os.environ["NAME"]` + `.env` + `python-dotenv` |
| `debug=True` / `DEBUG = True` in production | Shows code and secrets on error pages | Read from env; False in production |
| SQL built with f-strings | SQL injection | Parameterised queries / the ORM |
| No `requirements.txt` | Nobody can install the app | `pip freeze > requirements.txt` |
| `venv/` committed | Huge repo, breaks on other machines | Add `venv/` to `.gitignore` |
| `CORS(app)` / `allow_origins=["*"]` | Any site can call the API | List your real frontend URL |
| No input checks (Flask) | Junk data | Use Pydantic/Marshmallow or manual checks |
| Bare `except:` | Hides real errors | Catch specific errors and log them |

## Deployment

Render, Railway, Fly.io, PythonAnywhere, or a VPS with gunicorn/uvicorn. Streamlit → Streamlit Community Cloud.
