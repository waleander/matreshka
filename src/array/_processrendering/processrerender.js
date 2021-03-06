import getAlreadyRendered from './getalreadyrendered';
import renderItemNode from './renderitemnode';
import triggerOne from '../../trigger/_triggerone';

// this function re-inserts rendered DOM nodes of items
// if they are rendered and forceRerender is falsy
// and renders array items from scratch if they aren't rendered yet or forceRerender is truthy
export default function processRerender({
    self,
    selfDef,
    eventOptions,
    container
}) {
    const { forceRerender, silent } = eventOptions;

    // iterate over all items
    for (let i = 0; i < self.length; i++) {
        const item = self[i];
        if (item && typeof item === 'object') {
            const alreadyRenderedNode = getAlreadyRendered({
                item,
                selfDef
            });

            // if item is already rendered and forceRerender is falsy then re-insert DOM node
            // go to the next cycle iteration then
            if (!forceRerender && alreadyRenderedNode) {
                container.appendChild(alreadyRenderedNode);
                continue;
            }

            // node removal is called when an item is rendered
            // and forceRerender is truty
            if (alreadyRenderedNode) {
                if (container.contains(alreadyRenderedNode)) {
                    container.removeChild(alreadyRenderedNode);
                }
            }

            // render new node
            const { node, itemEventOptions } = renderItemNode({
                selfDef,
                self,
                item,
                eventOptions
            });

            if (node) {
                container.appendChild(node);

                if (!silent) {
                    triggerOne(item, 'afterrender', itemEventOptions);
                }
            }
        }
    }
}
