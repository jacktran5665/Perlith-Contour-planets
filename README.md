# Exoplanet Topographic Map Generator

A Flask web app that generates beautiful, random exoplanet topographic maps with animated starfield backgrounds.

## Features
- Generates unique planet maps using Perlin noise and contour lines
- Animated starfield background
- Interactive UI with planet zoom and generate button
- Ready for deployment on Railway or similar platforms

## Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd perlinplanet
   ```

2. **Create a virtual environment (optional but recommended):**
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # Or
   source .venv/bin/activate  # On Mac/Linux
   ```

3. **Install dependencies:**
   ```sh
   pip install -r requirements.txt
   ```

## Usage (Local Development)

1. **Run the app:**
   ```sh
   python app.py
   ```
2. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```
3. **Click the 'Generate' button** to create new random planets!

## Deployment (Railway)

1. Push your code to a GitHub repository.
2. Go to [Railway](https://railway.app) and create a new project.
3. Select "Deploy from GitHub repo" and choose your repository.
4. Railway will auto-detect your Python app and install dependencies from `requirements.txt`.
5. Ensure your `Procfile` contains:
   ```
   web: python app.py
   ```
6. Set the environment variable `PORT` to `8080` if Railway does not do this automatically.
7. Deploy and get your public URL!

## Project Structure
```
app.py
Procfile
requirements.txt
static/
    main.js
    starfield.js
    style.css
templates/
    index.html
```

## Requirements
- Python 3.8+
- Flask
- numpy, matplotlib, scipy, pillow, perlin_noise

## License
MIT
