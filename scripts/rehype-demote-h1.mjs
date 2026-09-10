import { visit } from 'unist-util-visit';

/** The layout renders the page H1. A # heading in a body becomes an H2 instead of a second H1. */
export function rehypeDemoteH1() {
  return (tree) => {
    visit(tree, 'element', (node) => { if (node.tagName === 'h1') node.tagName = 'h2'; });
  };
}
