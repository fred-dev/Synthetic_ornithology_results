import os
import json
import librosa
import soundfile as sf
import tempfile
import shutil
import numpy as np
from frechet_audio_distance import FrechetAudioDistance

# Load the audio pairs JSON file
with open('audio_pairs.json', 'r') as f:
    audio_pairs = json.load(f)

# Set the root path for the audio files
root_path = 'audioSamples/'

# Initialize the Frechet Audio Distance calculator with VGGish model
frechet = FrechetAudioDistance(
    model_name="vggish",
    sample_rate=16000,
    use_pca=False,
    use_activation=False,
    verbose=True
)

# Function to resample audio files to 16000 Hz
def resample_audio(input_path, output_path, target_sample_rate=16000):
    audio, sr = librosa.load(input_path, sr=None)  # Load audio with original sample rate
    audio_resampled = librosa.resample(audio, orig_sr=sr, target_sr=target_sample_rate)
    
    # Ensure the directory for the output path exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    sf.write(output_path, audio_resampled, target_sample_rate)

# Create directories to store embeddings if they don't exist
os.makedirs('embeddings/original', exist_ok=True)
os.makedirs('embeddings/generated', exist_ok=True)

# Create a directory to store resampled audio files
resampled_dir = 'resampled'
os.makedirs(resampled_dir, exist_ok=True)

# Calculate FAD for each pair
for pair in audio_pairs:
    original_path = os.path.join(root_path, pair['original'])
    generated_path = os.path.join(root_path, pair['generated'])
    
    resampled_original_path = os.path.join(resampled_dir, f"resampled_{os.path.basename(pair['original'])}")
    resampled_generated_path = os.path.join(resampled_dir, f"resampled_{os.path.basename(pair['generated'])}")

    print(f"Resampling {original_path} to {resampled_original_path}")
    print(f"Resampling {generated_path} to {resampled_generated_path}")

    # Resample audio files to 16000 Hz
    resample_audio(original_path, resampled_original_path)
    resample_audio(generated_path, resampled_generated_path)
    
    original_embedding_path = os.path.join('embeddings/original', f"{pair['pair']}.npy")
    generated_embedding_path = os.path.join('embeddings/generated', f"{pair['pair']}.npy")

    # Check if the files exist
    if not os.path.isfile(resampled_original_path):
        print(f"Error: Resampled original file not found: {resampled_original_path}")
    if not os.path.isfile(resampled_generated_path):
        print(f"Error: Resampled generated file not found: {resampled_generated_path}")

    try:
        # Create temporary directories to hold the resampled files
        with tempfile.TemporaryDirectory() as original_temp_dir, tempfile.TemporaryDirectory() as generated_temp_dir:
            temp_original_path = os.path.join(original_temp_dir, os.path.basename(resampled_original_path))
            temp_generated_path = os.path.join(generated_temp_dir, os.path.basename(resampled_generated_path))

            # Copy resampled files to temporary directories
            shutil.copy(resampled_original_path, temp_original_path)
            shutil.copy(resampled_generated_path, temp_generated_path)

            # Print paths to debug
            print(f"Calculating FAD score for {temp_original_path} and {temp_generated_path}")
            print(f"Using embeddings paths: {original_embedding_path}, {generated_embedding_path}")

            # Calculate FAD score
            fad_score = frechet.score(
                original_temp_dir,
                generated_temp_dir,
                background_embds_path=original_embedding_path,
                eval_embds_path=generated_embedding_path,
                dtype="float32"
            )

            # Convert fad_score to a float if necessary
            fad_score = float(fad_score)

    
    except Exception as e:
        print(f"[Frechet Audio Distance] An error occurred: {e}")
        fad_score = -1

    # Add the FAD score to the pair entry
    pair['fad_score'] = fad_score
    print(f"Pair {pair['pair']} FAD score: {fad_score}")

# Save the updated audio pairs JSON file
with open('audio_pairs_fad.json', 'w') as f:
    json.dump(audio_pairs, f, indent=4)

print("Updated audio pairs JSON file with FAD scores saved as 'audio_pairs_fad.json'")
