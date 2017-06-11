import React, { Component } from 'react';

import './Home.less';

export default class Home extends Component {
  state = {
    msg: new SpeechSynthesisUtterance(),
    voices: [],
    voicesItems: [],
    text: 'Hello! We are ReactMaker 👍',
    rate: 1,
    pitch: 1.5,
  }

  componentWillMount() {
    const { msg, text } = this.state;
    msg.text = text;

    this.setState({
      msg
    });
  }

  componentDidMount() {
    speechSynthesis.addEventListener('voiceschanged', this.populateVoices);
  }

  setVoice = (e) => {
    const { msg, voices } = this.state;

    msg.voice = voices.find(voice => voice.name === e.target.value);
    this.setState({
      msg
    }, () => {
      this.toggle();
    });
  }

  setOption = (e) => {
    const { msg } = this.state;
    msg[e.target.name] = e.target.value;
    this.setState({
      msg,
      [e.target.name]: e.target.value,
    }, () => {
      this.toggle();
    });
  }

  toggle = (startOver = true) => {
    const { msg } = this.state;

    speechSynthesis.cancel();
    if (startOver) {
      speechSynthesis.speak(msg);
    }
  }

  populateVoices = (e) => {
    const voices = e.target.getVoices();

    const voicesItems = voices
      .filter(voice => voice.lang.includes('en'))
      .map(voice => ({ name: voice.name, lang: voice.lang }));

    this.setState({ voices, voicesItems });
  }

  render() {
    const { voicesItems, text, rate, pitch } = this.state;

    return (
      <div className="voiceinator">
        <h1>The Voiceinator 5000</h1>
        <select id="voices" onChange={this.setVoice}>
          {
            voicesItems.map((voice, index) =>
              <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>)
          }
        </select>
        <label htmlFor="rate">Rate:</label>
        <input name="rate" onChange={this.setOption} value={rate} type="range" min="0" max="3" step="0.1" />
        <label htmlFor="pitch" >Pitch:</label>
        <input name="pitch" onChange={this.setOption} value={pitch} type="range" min="0" max="2" step="0.1" />
        <textarea name="text" onChange={this.setOption}>{text}</textarea>
        <button id="stop" onClick={() => this.toggle(false)}>Stop!</button>
        <button id="speak" onClick={this.toggle}>Speak</button>
      </div>
    );
  }
}
