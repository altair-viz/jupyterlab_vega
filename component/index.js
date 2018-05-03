import React from 'react';
import vegaEmbed from 'vega-embed';
import './index.css';

export default class Vega extends React.Component {
  static defaultProps = {
    callback: () => ({}),
    mode: 'vega-lite',
    width: 840,
    height: 360
  };

  componentDidMount() {
    this.embed();
  }

  componentDidUpdate() {
    this.embed();
  }

  render() {
    return <div 
      ref={element => {
        this.element = element;
      }} 
    />;
  }

  embed = () => {
    const {
      spec,
      mode,
      callback,
      width,
      height
    } = this.props;
    const embedSpec = {
      mode,
      spec: {
        ...spec,
        width,
        height
      }
    };
    vegaEmbed(this.element, embedSpec, callback);
  };
}
