"""Generate the dot-matrix Europe grid used by /countries.

Output: apps/web/src/data/europe-dots.json (committed). The Natural Earth source
files are NOT committed; download them first:

  curl -sSLo /tmp/ne_adm0.geojson \
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson
  curl -sSLo /tmp/ne_adm1.geojson \
    https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson
  python3 -m venv /tmp/dots-venv && /tmp/dots-venv/bin/pip install shapely numpy
  /tmp/dots-venv/bin/python apps/web/scripts/europe-dots/build_grid.py

Admin-1 polygons are used (not admin-0) so that only the European part of
Turkey is drawn. Each dot is assigned to one country (ISO 3166-1 alpha-2).
Projection: spherical Lambert azimuthal equal-area centred on 10E 52N.
A cell becomes a dot when its centre is on land or at least 22% of it is land.
"""
import json, math, sys
from pathlib import Path
import numpy as np
from shapely.geometry import shape, Point, box, MultiPolygon
from shapely.strtree import STRtree
from shapely.ops import unary_union, polylabel
import shapely

ADM1 = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ne_adm1.geojson'
OUT = Path(__file__).resolve().parents[2] / 'src' / 'data' / 'europe-dots.json'
S = 55.0  # km per dot
R = 6371.0; LON0 = 10.0; LAT0 = 52.0
L0 = math.radians(LON0); P0 = math.radians(LAT0)

def proj(lon, lat):
    l = np.radians(lon); p = np.radians(lat)
    k = np.sqrt(2 / (1 + math.sin(P0) * np.sin(p) + math.cos(P0) * np.cos(p) * np.cos(l - L0)))
    return R * k * np.cos(p) * np.sin(l - L0), R * k * (math.cos(P0) * np.sin(p) - math.sin(P0) * np.cos(p) * np.cos(l - L0))

EUROPE = set('IS IE GB PT ES FR BE NL LU DE CH IT MT AT CZ PL DK NO SE FI EE LV LT BY UA MD RO BG GR HU SK SI HR BA RS ME AL MK XK CY AD LI MC SM RU TR FO GI IM JE GG AX'.split())
TR_EU = {'Edirne', 'Kirklareli', 'Kırklareli', 'Tekirdag', 'Tekirdağ', 'Istanbul', 'İstanbul'}
ALIAS = {'AX': 'FI', 'JE': 'GB', 'GG': 'GB', 'IM': 'GB', 'GI': 'GB'}  # crown dependencies etc. drawn with the nearest state

feats = json.load(open(ADM1))['features']
parts = {}
for f in feats:
    p = f['properties']; cc = p['iso_a2']
    if p['admin'] == 'Northern Cyprus': cc = 'CY'
    if p['admin'] == 'Kosovo': cc = 'XK'
    if cc not in EUROPE: continue
    if cc == 'TR' and p['name'] not in TR_EU: continue
    if cc == 'FR' and 'Overseas' in (p.get('type_en') or ''): continue
    g = shape(f['geometry'])
    if cc == 'NO' and g.geom_type == 'MultiPolygon':  # drop Jan Mayen and Svalbard
        g = MultiPolygon([q for q in g.geoms if q.centroid.x > 0 and q.centroid.y < 75])
        if g.is_empty: continue
    g = g.simplify(0.01)
    g = shapely.transform(g, lambda c: np.column_stack(proj(c[:, 0], c[:, 1])))
    parts.setdefault(ALIAS.get(cc, cc), []).append(g)
countries = {cc: unary_union(gs).buffer(0) for cc, gs in parts.items()}

pts = [(-24.9, 65.4), (-24.5, 63.3), (33.0, 34.55), (24.7, 34.8), (-9.5, 36.9), (25.8, 71.2), (16, 69.5)]
xs, ys = zip(*[proj(a, b) for a, b in pts])
xmin = float(min(xs) - 60); xmax = float(proj(47.0, 56.0)[0])
ymin = float(min(ys) - 50); ymax = float(max(ys) + 40)
nx = int((xmax - xmin) // S) + 1; ny = int((ymax - ymin) // S) + 1
keys = list(countries); geoms = [countries[k] for k in keys]; tree = STRtree(geoms)

cells = {}
for j in range(ny):
    for i in range(nx):
        cx = xmin + S / 2 + i * S; cy = ymax - S / 2 - j * S
        c = Point(cx, cy); cell = box(cx - S / 2, cy - S / 2, cx + S / 2, cy + S / 2)
        cand = tree.query(cell)
        if len(cand) == 0: continue
        hit = next((gi for gi in cand if geoms[gi].contains(c)), None)
        if hit is None:
            areas = [(geoms[gi].intersection(cell).area / cell.area, gi) for gi in cand]
            if sum(a for a, _ in areas) >= 0.22: hit = max(areas)[1]
        if hit is not None: cells[(i, j)] = keys[hit]

# Small states with no dot of their own get one at their capital.
CAP = {'MT': (14.51, 35.9), 'LU': (6.13, 49.61), 'CY': (33.37, 35.17), 'FO': (-6.77, 62.01)}
for cc, (lo, la) in CAP.items():
    if cc in cells.values(): continue
    x, y = proj(lo, la); i = int((x - xmin) // S); j = int((ymax - y) // S)
    free = [(di * di + dj * dj, i + di, j + dj) for di in range(-2, 3) for dj in range(-2, 3) if (i + di, j + dj) not in cells]
    if free and min(free)[0] <= 2:
        _, i, j = min(free)
    cells[(i, j)] = cc

# Visual centre per country, in grid units, for the Releases markers: the pole of
# inaccessibility of the largest connected block of the country's own cells (the
# mainland as drawn in dots, so not Corsica, Svalbard or the Greek islands).
centres = {}
by_cc = {}
for (i, j), cc in cells.items():
    by_cc.setdefault(cc, []).append(box(i, j, i + 1, j + 1))
for cc, boxes in sorted(by_cc.items()):
    u = unary_union(boxes)
    polys = list(u.geoms) if u.geom_type == 'MultiPolygon' else [u]
    main = max(polys, key=lambda q: q.area)
    pt = polylabel(main, tolerance=0.05)
    centres[cc] = [round(pt.x, 2), round(pt.y, 2)]

out = {}
for (i, j), cc in sorted(cells.items(), key=lambda t: (t[0][1], t[0][0])):
    out.setdefault(cc, []).extend([i, j])
data = {
    'source': 'Natural Earth 1:10m admin-1 (public domain), generated by scripts/europe-dots/build_grid.py',
    'spacingKm': S,
    'projection': {'type': 'laea-sphere', 'lon0': LON0, 'lat0': LAT0, 'radiusKm': R, 'xmin': round(xmin, 3), 'ymax': round(ymax, 3)},
    'nx': nx, 'ny': ny,
    'dots': out,
    'centres': centres,
}
OUT.write_text(json.dumps(data, separators=(',', ':')) + '\n')
print(f'{len(cells)} dots, {len(out)} countries, grid {nx}x{ny} -> {OUT} ({OUT.stat().st_size} bytes)')
