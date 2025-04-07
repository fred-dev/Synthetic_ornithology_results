// If you keep all audio files under a specific folder, define it here:
const rootPathErrors = "audioSamples/interesting/";

// Array to store WaveSurfer instances
const waveSurfers = [];

// Function to stop all currently playing audio except for the one being played
const stopAllExcept = (currentWaveSurfer) => {
  waveSurfers.forEach((waveSurfer) => {
    if (waveSurfer !== currentWaveSurfer && waveSurfer.isPlaying()) {
      waveSurfer.stop();
    }
  });
};

// Fetch the JSON file containing error entries
fetch("audio_interesting.json")
  .then((response) => response.json())
  .then((data) => {
    // Grab the container where we'll display the entries
    const container = document.getElementById("errors-list");

    data.forEach((errorItem) => {
      // Create a wrapper for each error entry
      const errorEntry = document.createElement("div");
      errorEntry.className = "error-entry";

      // Title (label)
      const heading = document.createElement("h2");
      heading.textContent = errorItem.label;
      errorEntry.appendChild(heading);

      // Description
      const descriptionPara = document.createElement("p");
      descriptionPara.textContent = errorItem.description;
      errorEntry.appendChild(descriptionPara);

      // Steps
      const stepsPara = document.createElement("p");
      stepsPara.innerHTML = `<strong>Steps (Training):</strong> ${errorItem.steps}`;
      errorEntry.appendChild(stepsPara);

      // CFG Scale
      const cfgScalePara = document.createElement("p");
      cfgScalePara.innerHTML = `<strong>CFG Scale:</strong> ${errorItem.cfg_scale}`;
      errorEntry.appendChild(cfgScalePara);

      // Waveform container
      const waveformContainer = document.createElement("div");
      waveformContainer.className = "waveform-container";

      // Div to hold the actual waveform
      const waveformDiv = document.createElement("div");
      // Use a unique ID for each waveform (based on filename, label, or index)
      waveformDiv.id = `waveform-${errorItem.filename.replace(/\W/g, "_")}`;

      // Append the waveform div to the container
      waveformContainer.appendChild(waveformDiv);
      errorEntry.appendChild(waveformContainer);

      // Finally, attach the entire entry to the main container
      container.appendChild(errorEntry);

      // Now create a WaveSurfer instance for this single file
      const waveSurfer = WaveSurfer.create({
        container: `#${waveformDiv.id}`,
        waveColor: "violet",
        progressColor: "purple",
        height: 100,
        normalize: false,
        mediaControls: true,
        interact: true,
        fillParent: true,
        autoCenter: true,
        hideScrollbar: false,
        backend: 'MediaElement', // Use MediaElement backend for simplicity
      });
      
      waveSurfer.load(rootPathErrors + errorItem.filename);
      
      waveSurfer.once('ready', () => {
        const audioContext = new AudioContext();
        const mediaElement = waveSurfer.getMediaElement();
        const sourceNode = audioContext.createMediaElementSource(mediaElement);
      
        const splitter = audioContext.createChannelSplitter(2);
        const merger = audioContext.createChannelMerger(2);
      
        sourceNode.connect(splitter);
      
        splitter.connect(merger, 0, 0); // Duplicate left channel
        splitter.connect(merger, 0, 1); // Duplicate to right channel
      
        merger.connect(audioContext.destination);
      });
      
      waveSurfers.push(waveSurfer);
      
      waveSurfer.on("play", () => stopAllExcept(waveSurfer));
    });
  })
  .catch((error) => console.error("Error loading error entries:", error));