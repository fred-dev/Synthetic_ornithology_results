import json

# Load the audio pairs JSON file
with open('audio_pairs.json', 'r') as f:
    audio_pairs = json.load(f)

# Load the larger metadata JSON file
with open('/Users/fredrodrigues/Dropbox/Code/OF_GITT/openFrameworks/apps/Synthetic_ornithology/Synthetic_Ornithology_python_scripts/split_JSON_into_individual_files/synthetic_ornithology_complete_pre_water_BU.json', 'r') as f:
    metadata = json.load(f)

# Create a dictionary for quick lookup of metadata by filename
metadata_dict = {entry['filename']: entry for entry in metadata}

# Update each audio pair with the additional metadata
for pair in audio_pairs:
    original_tags = pair['originalTags']
    if original_tags in metadata_dict:
        meta = metadata_dict[original_tags]
        pair.update({
            'placeName': meta.get('name', ''),
            'latitude': meta.get('coord', {}).get('lat', ''),
            'longitude': meta.get('coord', {}).get('lon', ''),
            'dateName': meta.get('dateName', ''),
            'temperature': meta.get('main', {}).get('temp', ''),
            'humidity': meta.get('main', {}).get('humidity', ''),
            'pressure': meta.get('main', {}).get('pressure', ''),
            'windSpeed': meta.get('wind', {}).get('speed', '')
        })

# Save the updated audio pairs JSON file
with open('audio_pairs_updated.json', 'w') as f:
    json.dump(audio_pairs, f, indent=4)

print("Updated audio pairs JSON file saved as 'audio_pairs_updated.json'")
