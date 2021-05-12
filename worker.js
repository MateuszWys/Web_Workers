const process = (data) =>{
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];

    // CIE luminance for the RGB
    // The human eye is bad at seeing red and blue, so we de-emphasize them.
    data[i] = data[i + 1] = data[i + 2] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
};

addEventListener('message', ({ data }) => {
  process(data.imageData.data);
  postMessage(data.imageData);
});