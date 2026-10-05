export const createEl = (tag, { className, text, attrs, children } = {}) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  }
  if (children) node.append(...children);
  return node;
};
