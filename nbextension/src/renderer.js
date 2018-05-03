import React from 'react';
import ReactDOM from 'react-dom';
import VegaComponent from 'jupyter_vega_react';
import './index.css';

const VEGA_MIME_TYPE = 'application/vnd.vega.v2+json';
const VEGALITE_MIME_TYPE = 'application/vnd.vegalite.v1+json';
const CLASS_NAME = 'output_Vega rendered_html';
const DEFAULT_WIDTH = 840;
const DEFAULT_HEIGHT = 360;

/**
 * Render data to the DOM node
 */
function render(props, node) {
  ReactDOM.render(<VegaComponent {...props} />, node);
}

/**
 * Handle when an output is cleared or removed
 */
function handleClearOutput(event, { cell: { output_area } }) {
  /* Get rendered DOM node */
  const toinsert = output_area.element.find(`.${CLASS_NAME.split(' ')[0]}`);
  /* e.g. Dispose of resources used by renderer library */
  if (toinsert[0]) ReactDOM.unmountComponentAtNode(toinsert[0]);
}

/**
 * Register the mime type and append_mime function with the notebook's 
 * output area
 */
export function register_renderer(notebook, events, OutputArea) {
  /* A function to render output of 'application/vnd.vega.v2+json' mime type */
  const append_mime = function(mimetype) {
    return function(data, metadata, element) {
      /* Create a DOM node to render to */
      const toinsert = this.create_output_subarea(
        metadata,
        CLASS_NAME,
        mimetype
      );
      this.keyboard_manager.register_events(toinsert);
      /* Render data to DOM node */
      const props = {
        spec: data,
        metadata: metadata[mimetype],
        mode: mimetype === 'application/vnd.vegalite.v1+json'
          ? 'vega-lite'
          : 'vega',
        callback: (error, result) => {
          if (error) return console.log(error);
          // Add a static image output to mime bundle
          const imageData = result.view.toImageURL().split(',')[1];
          this.outputs
            .filter(output => output.data[mimetype])
            .forEach(output => {
              output.data['image/png'] = imageData;
            });
        }
      };
      render(props, toinsert[0]);
      element.append(toinsert);
      return toinsert;
    };
  };

  /* Handle when an output is cleared or removed */
  events.on('clear_output.CodeCell', handleClearOutput);
  events.on('delete.Cell', handleClearOutput);

  /**
   * Register the mime type and append_mime function with output_area
   */
  const index = 0;
  OutputArea.prototype.register_mime_type(
    VEGA_MIME_TYPE,
    append_mime(VEGA_MIME_TYPE),
    {
      // Is output safe?
      safe: true,
      // Index of renderer in `output_area.display_order`
      index: index
    }
  );
  OutputArea.prototype.register_mime_type(
    VEGALITE_MIME_TYPE,
    append_mime(VEGALITE_MIME_TYPE),
    {
      // Is output safe?
      safe: true,
      index: index
    }
  );
}

/**
 * Re-render cells with output data of 'application/vnd.vega.v2+json' mime type
 * on load notebook
 */
export function render_cells(notebook) {
  // Get all cells in notebook
  notebook.get_cells().forEach(cell => {
    // If a cell has output data of 'application/geo+json' mime type
    if (
      cell.output_area &&
      cell.output_area.outputs.find(
        output =>
          output.data &&
          (output.data[VEGA_MIME_TYPE] || output.data[VEGALITE_MIME_TYPE])
      )
    ) {
      // Re-render the cell by executing it
      notebook.render_cell_output(cell);
    }
  });
}
