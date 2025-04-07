const rootPathPairs = "audioSamples/pairs/"; // Set the root path for the audio files
const waveSurfers = []; // Array to keep track of WaveSurfer instances

// Function to stop all playing audio except the one that is about to play
const stopAllExcept = (currentWaveSurfer) => {
    waveSurfers.forEach((waveSurfer) => {
        if (waveSurfer !== currentWaveSurfer && waveSurfer.isPlaying()) {
            waveSurfer.stop();
        }
    });
};
fetch("audio_pairs.json") // Use the updated JSON with additional metadata
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("audio-pairs");
        data.forEach((pair) => {
            const pairContainer = document.createElement("div");
            pairContainer.className = "pair-container";

            const heading = document.createElement("h2");
            heading.textContent = `Recorded species: ${pair.name}`;
            pairContainer.appendChild(heading);

            const conditionContainer = document.createElement("div");
            conditionContainer.className = "condition-container";

            const conditionHeading = document.createElement("h3");
            conditionHeading.textContent = "Conditioning Data";
            conditionContainer.appendChild(conditionHeading);

            const dateText = document.createElement("p");
            dateText.innerHTML = `<strong>Date:</strong> ${pair.dateName}`;
            conditionContainer.appendChild(dateText);

            const placeText = document.createElement("p");
            placeText.innerHTML = `<strong>Place:</strong> ${pair.placeName} (${pair.latitude}, ${pair.longitude})`;
            conditionContainer.appendChild(placeText);

            const tempText = document.createElement("p");
            tempText.innerHTML = `<strong>Temperature:</strong> ${pair.temperature}°C`;
            conditionContainer.appendChild(tempText);

            const humidityText = document.createElement("p");
            humidityText.innerHTML = `<strong>Humidity:</strong> ${pair.humidity}%`;
            conditionContainer.appendChild(humidityText);

            const pressureText = document.createElement("p");
            pressureText.innerHTML = `<strong>Pressure:</strong> ${pair.pressure} hPa`;
            conditionContainer.appendChild(pressureText);

            const windText = document.createElement("p");
            windText.innerHTML = `<strong>Wind Speed:</strong> ${pair.windSpeed} m/s`;
            conditionContainer.appendChild(windText);

            const audioRow = document.createElement("div");
            audioRow.className = "audio-container";

            const originalWaveformContainer = document.createElement("div");
            originalWaveformContainer.className = "waveform-container";

            const originalWaveform = document.createElement("div");
            originalWaveform.className = "waveform";
            originalWaveform.id = `waveform-original-${pair.pair}`;

            const generatedWaveformContainer = document.createElement("div");
            generatedWaveformContainer.className = "waveform-container";

            const generatedWaveform = document.createElement("div");
            generatedWaveform.className = "waveform";
            generatedWaveform.id = `waveform-generated-${pair.pair}`;

            const originalLabel = document.createElement("div");
            originalLabel.className = "audio-label";
            originalLabel.textContent = "Original";

            const generatedLabel = document.createElement("div");
            generatedLabel.className = "audio-label";
            generatedLabel.textContent = "Generated";

            originalWaveformContainer.appendChild(originalWaveform);
            generatedWaveformContainer.appendChild(generatedWaveform);

            audioRow.appendChild(originalLabel);
            audioRow.appendChild(originalWaveformContainer);
            audioRow.appendChild(generatedLabel);
            audioRow.appendChild(generatedWaveformContainer);

            pairContainer.appendChild(audioRow);
            pairContainer.appendChild(conditionContainer);
            container.appendChild(pairContainer);

            const createWaveSurferStereo = async (containerId, waveColor, progressColor, audioUrl) => {
                // Create WaveSurfer instance with media controls
                const waveSurfer = WaveSurfer.create({
                    container: containerId,
                    waveColor,
                    progressColor,
                    url: audioUrl,
                    mediaControls: true,
                    backend: 'MediaElement', // use MediaElement backend directly
                    height: 100,
                    splitChannels: false,
                    interact: true,
                    autoCenter: true,
                });
            
                waveSurfer.once('ready', () => {
                    const audioContext = new AudioContext();
                    const mediaElement = waveSurfer.getMediaElement();
                    const sourceNode = audioContext.createMediaElementSource(mediaElement);
            
                    // Create a channel splitter and merger for mono-to-stereo
                    const splitter = audioContext.createChannelSplitter(2);
                    const merger = audioContext.createChannelMerger(2);
            
                    sourceNode.connect(splitter);
            
                    // If mono, duplicate channel 0 into both left and right
                    splitter.connect(merger, 0, 0); // Left
                    splitter.connect(merger, 0, 1); // Right
            
                    merger.connect(audioContext.destination);
                });
            
                return waveSurfer;
            };
            
            // Integrate with your existing setup
            (async () => {
                const originalWaveSurfer = await createWaveSurferStereo(
                    `#waveform-original-${pair.pair}`,
                    "violet",
                    "purple",
                    rootPathPairs + pair.original
                );
            
                const generatedWaveSurfer = await createWaveSurferStereo(
                    `#waveform-generated-${pair.pair}`,
                    "orange",
                    "red",
                    rootPathPairs + pair.generated
                );
            
                waveSurfers.push(originalWaveSurfer, generatedWaveSurfer);
            
                originalWaveSurfer.on("play", () => stopAllExcept(originalWaveSurfer));
                generatedWaveSurfer.on("play", () => stopAllExcept(generatedWaveSurfer));
            })();
            
            // Add player controls
            const originalControls = document.createElement("div");
            originalControls.className = "player-controls";
            originalWaveformContainer.appendChild(originalControls);

            const generatedControls = document.createElement("div");
            generatedControls.className = "player-controls";
            generatedWaveformContainer.appendChild(generatedControls);
        });
    })
    .catch((error) => console.error("Error loading audio pairs:", error));
