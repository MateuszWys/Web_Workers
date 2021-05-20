import {AbstractWebComponent} from './AbstractWebComponent.js';
import {RectanglePicker} from './RectanglePicker.js';

const template = `
<details>
  <summary>Noise in images</summary>
  <section>
    <h4>Select noise options</h4>
    <div id="rectangles-pickers-wrapper">
      <kk-rectangle-picker></kk-rectangle-picker>
    </div>
  </section>
  <div>
      <label for="workers-count">Number of webworkers:</label>
      <input id="workers-count" name="workers-count" type="number" value="10" />
  </div>  
  <button id="start-processing">Start</button>
  <div>
      <label for="postprocessing-progress">Progress change image:</label>
      <progress id="postprocessing-progress" max="100" value="0"></progress>
  </div>
  <canvas id="postprocessing-output" />
</details>
`; 

export class NoiseProcessor extends AbstractWebComponent {
  constructor() {
    super(template);
    this.workers = [];
    this.getElementsReferences()
    this.setUpListeners();
  }

  connectedCallback() {
    super.connectedCallback();
    this.outputCtx = this.outputImg.getContext('2d');
  }

  getElementsReferences() {
    this.pickersWrapper = this.shadowRoot.querySelector('#rectangles-pickers-wrapper');
    this.workersCount = this.shadowRoot.querySelector('#workers-count');
    this.startBtn = this.shadowRoot.querySelector('#start-processing');
    this.progressBar = this.shadowRoot.querySelector('#postprocessing-progress');
    this.outputImg = this.shadowRoot.querySelector('#postprocessing-output');
  }

  setUpListeners() {
    this.startBtn.addEventListener('click', this.startPreprocessing);
    const progressBarObserver = new MutationObserver(() => {
      if (this.progressBar.value === this.progressBar.max) {
        this.disposeWorkers();
      }
    });
    progressBarObserver.observe(this.progressBar, {attributes: true});
  }

  setInputImg(inputImg) {
    this.inputImg = inputImg;
    this.inputCtx = inputImg.getContext('2d');
    this.outputImg.width = this.inputImg.width;
    this.outputImg.height = this.inputImg.height;
    this.outputCtx.putImageData(this.inputCtx.getImageData(0, 0, this.inputImg.width, this.inputImg.height), 0, 0);
    this.resetOutputCanvas();
    this.resetProgress();
  }

  resetOutputCanvas() {
    this.outputCtx.putImageData(this.inputCtx.getImageData(0, 0, this.inputImg.width, this.inputImg.height), 0, 0);
  }

  resetProgress() {
    this.progressBar.value = 0;
    this.progressBar.max = parseInt(this.workersCount.value);
  }

  startPreprocessing = () => {
  }
}

customElements.define('kk-noise-processor', NoiseProcessor);