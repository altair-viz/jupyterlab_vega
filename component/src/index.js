import React from 'react';
import vegaEmbed from 'vega-embed';
import '../index.css';

export default class Vega extends React.Component {
  static defaultProps = {
    renderedCallback: () => ({}),
    embedMode: 'vega-lite',
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
    return <div ref={el => this.el = el} />;
  }

  embed = () => {
    const {
      data: spec,
      embedMode: mode,
      renderedCallback: cb,
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
    vegaEmbed(this.el, embedSpec, cb);
  };
}
