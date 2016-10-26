
import {
  Kernel
} from '@jupyterlab/services';

import {
  ABCWidgetFactory, DocumentRegistry
} from 'jupyterlab/lib/docregistry';

import {
  IRenderMime
} from 'jupyterlab/lib/rendermime';

import {
    VegaWidget, VegaLiteWidget
} from './widget';


export
class VegaWidgetFactory extends ABCWidgetFactory<VegaWidget, DocumentRegistry.IModel> {

  createNew(context: DocumentRegistry.IContext<DocumentRegistry.IModel>, kernel?: Kernel.IModel): VegaWidget {
    let widget = new VegaWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }

}


export
class VegaLiteWidgetFactory extends ABCWidgetFactory<VegaLiteWidget, DocumentRegistry.IModel> {

  createNew(context: DocumentRegistry.IContext<DocumentRegistry.IModel>, kernel?: Kernel.IModel): VegaLiteWidget {
    let widget = new VegaLiteWidget(context);
    this.widgetCreated.emit(widget);
    return widget;
  }

}