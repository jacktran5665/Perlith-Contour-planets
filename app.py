from flask import Flask, send_file, render_template
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


from PIL import Image, ImageDraw
from perlin_noise import PerlinNoise
import random

def generate_exoplanet(size=400):
    # Perlin noise parameters
    scale = random.uniform(2.5, 4.5)
    octaves = random.randint(4, 7)
    seed = random.randint(0, 10000)
    noise = PerlinNoise(octaves=octaves, seed=seed)

    # Only two colors: black for regions, white for contour lines
    region_color = (0, 0, 0)
    contour_color = (255, 255, 255)

    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    cx, cy = size // 2, size // 2
    radius = size // 2 - 4

    contour_levels = 12  # Number of contour bands
    contour_thickness = 0.012  # Make lines thinner and less aggressive
    for y in range(size):
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = (dx ** 2 + dy ** 2) ** 0.5
            if dist <= radius:
                nx = x / size - 0.5
                ny = y / size - 0.5
                e = noise([nx * scale, ny * scale])
                e = (e + 1) / 2  # Normalize to [0,1]
                band_pos = e * contour_levels
                if abs(band_pos - round(band_pos)) < contour_thickness:
                    # Draw a white contour line (less aggressive)
                    img.putpixel((x, y), contour_color + (255,))
                else:
                    img.putpixel((x, y), region_color + (255,))
            else:
                img.putpixel((x, y), (0, 0, 0, 0))
    return img

@app.route('/random-planet')
def random_planet():
    import numpy as np
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from scipy.ndimage import gaussian_filter
    size = 600
    # Generate random height map
    np.random.seed()
    base = np.random.rand(size, size)
    height = gaussian_filter(base, sigma=32)
    # Skew distribution: more low ground, less high mountain
    height = 1 - np.power(height, 0.25)
    # Mask to circle
    y, x = np.ogrid[:size, :size]
    cx, cy = size // 2, size // 2
    mask = (x - cx) ** 2 + (y - cy) ** 2 <= (size // 2 - 4) ** 2
    height[~mask] = np.nan
    # Define color band sets
    from matplotlib.colors import ListedColormap
    green_bands = [
        '#0a2e0a', '#114d11', '#145c14', '#197d19', '#1e8c1e', '#228b22',
        '#2ecc40', '#43e97b', '#5fffa0', '#7fffd4', '#aaffc9', '#baffc9', '#eaffea'
    ]
    purple_bands = [
        '#1a102a', '#2d145c', '#3e1e8c', '#5a2ecc', '#7d43e9', '#a259f7',
        '#cfaaff', '#e0cfff', '#f3e6ff', '#b39ddb', '#9575cd', '#7e57c2', '#ede7f6'
    ]
    red_bands = [
        '#2a1010', '#5c1414', '#8c1e1e', '#cc2e2e', '#e94343', '#f75959',
        '#ffaaaa', '#ffd6d6', '#fff3f3', '#ffb3b3', '#ff7e7e', '#ff5252', '#fff0f0'
    ]
    blue_bands = [
        '#0a1a2e', '#114d5c', '#145c8c', '#197dbd', '#1e8cbe', '#228bb2',
        '#2ec3cc', '#43e9e9', '#5fffd0', '#7fffd4', '#aafff9', '#bafffa', '#eaffff'
    ]
    orange_bands = [
        '#2e1a0a', '#5c3d11', '#8c5c14', '#bd7d19', '#be8c1e', '#b28b22',
        '#ccc32e', '#e9c943', '#ffd05f', '#ffd47f', '#ffe6aa', '#fff6ba', '#fffbe6'
    ]
    color_sets = [green_bands, purple_bands, red_bands, blue_bands, orange_bands]
    color_names = ['green', 'purple', 'red', 'blue', 'orange']
    idx = random.randint(0, len(color_sets)-1)
    bands = color_sets[idx]
    cmap = ListedColormap(bands)
    n_levels = len(bands) + 2
    levels = np.linspace(np.nanmin(height), np.nanmax(height), n_levels)
    fig, ax = plt.subplots(figsize=(4,4), dpi=100)
    ax.set_axis_off()
    cf = ax.contourf(height, levels=levels, cmap=cmap, extend='both')
    # Overlay sharp contour lines (black for classic topo look)
    ax.contour(height, levels=levels, colors='black', linewidths=1, linestyles='solid')
    # Draw circular mask edge
    circ = plt.Circle((cx, cy), size//2-4, color='#10101a', fill=False, lw=4)
    ax.add_patch(circ)
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight', pad_inches=0, transparent=True)
    plt.close(fig)
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
