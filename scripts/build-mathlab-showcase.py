"""Rebuild the static portfolio fallback from a clean FantasyWorldGenerator checkout."""
import argparse
from pathlib import Path
import subprocess
import sys

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', type=Path, required=True)
args = parser.parse_args()
source = args.source.resolve()
subprocess.run([sys.executable, str(source / 'tools/export_showcase.py'),
                '--source', str(source), '--output',
                str(Path(__file__).resolve().parents[1] / 'public/mathlab')], check=True)
