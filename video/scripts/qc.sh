#!/usr/bin/env bash
# Contrôle d'un export : format, niveaux sonores, planche de lecture complète.
#   scripts/qc.sh exports/la-marilyn-lancement-vertical.mp4 [dossier de sortie]
set -euo pipefail
f="$1"; out="${2:-out/qc}"; name="$(basename "$f" .mp4)"
mkdir -p "$out"
ffprobe -v error -show_entries stream=codec_name,profile,pix_fmt,width,height,r_frame_rate,nb_frames,sample_rate,channels,duration,bit_rate -of compact "$f"
ffmpeg -hide_banner -nostats -i "$f" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|LRA:|Peak:" | tail -3
# Images noires ou figées inattendues
ffmpeg -hide_banner -nostats -i "$f" -vf "blackdetect=d=0.2:pix_th=0.06" -an -f null - 2>&1 | grep blackdetect || echo "aucune image noire"
# Une image toutes les demi-secondes, en planche
h=$(ffprobe -v error -select_streams v -show_entries stream=height -of csv=p=0 "$f")
if [ "$h" -gt 1200 ]; then tile="20x4"; scale="216:-1"; else tile="10x8"; scale="384:-1"; fi
ffmpeg -hide_banner -loglevel error -y -i "$f" -vf "fps=2,scale=$scale,tile=$tile" -frames:v 1 -q:v 3 "$out/$name-planche.jpg"
echo "planche : $out/$name-planche.jpg"
