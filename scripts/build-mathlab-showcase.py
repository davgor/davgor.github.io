"""Rebuild static exports from a reviewed icarusUnreal MathLab checkout (Python 3.12)."""
import argparse
import hashlib
import json
from pathlib import Path
import sys

parser = argparse.ArgumentParser()
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
source = args.source.resolve()
sys.path.insert(0, str(source / 'tools'))
import terrain_lab
from icarus_sim.terrain_world import generate_request

output = Path(__file__).resolve().parents[1] / 'public' / 'mathlab'
output.mkdir(parents=True, exist_ok=True)
worlds = [
    ('crossroads', 'The Crossroads', 42, {}, 'Five magical networks, competing habitats, settlements and beast lairs.'),
    ('frost', 'The Frostbound Reach', 73, {'temperature_offset': -12, 'seasonality': 1.4, 'mountain_abundance': 1.8}, 'Cold climates, snow and ice across mountain and coastal refuges.'),
    ('islands', 'The Shattered Coast', 108, {'archipelago_count': 10, 'archipelago_occurrence': 1., 'sky_occurrence': 1., 'sky_clusters': 5}, 'Ocean archipelagos, floating islands and coastal communities.'),
]
manifest = {'format': 1, 'source_repository': 'https://github.com/davgor/icarusUnreal', 'source_files': {}, 'worlds': []}
for folder in [source / 'Sim' / 'icarus_sim', source / 'tools']:
    for path in sorted(folder.iterdir()):
        if path.suffix in ('.py', '.json', '.js', '.html') and (folder.name == 'icarus_sim' or path.name.startswith('terrain_')):
            manifest['source_files'][path.relative_to(source).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
for slug, title, seed, overrides, description in worlds:
    world = generate_request({'seed': seed, 'overrides': {'size': 65, **overrides}})
    html = terrain_lab.report(world, live=False)
    # Snapshot-only presentation. Leave inspection/export controls functional.
    html += '''<style>
    #world-mode,#world-generate,#world-params,#patch-generate,#patch-land,.local-lab{display:none!important}
    .layout{display:block}aside{margin-bottom:20px}body{padding:16px}select{max-width:100%}
    </style><script>
    document.getElementById('world-status').textContent='Seed '+data.config.seed+' · Saved world showcase. Explore layers and lairs; generation runs offline.';
    document.querySelector('aside h2').textContent='Saved world';
    </script>'''
    path = output / (slug + '.html')
    path.write_text(html, encoding='utf-8')
    manifest['worlds'].append(dict(id=slug, title=title, description=description, file=path.name, seed=seed, recipe=world['recipe'], bytes=path.stat().st_size, sha256=hashlib.sha256(path.read_bytes()).hexdigest(), nests=len(world['beast_nests']['sites'])))
    print(slug, path.stat().st_size, 'bytes', flush=True)
(output / 'manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
