import React, { cloneElement } from "react";
import ReactDOM from "react-dom/client";

export function show(render: React.ReactElement, delay: number = 2000, el?: Element) {
  const container = document.createElement("div");

  if (el) {
    el.appendChild(container);
  } else {
    document.body.appendChild(container);
  }

  const root = ReactDOM.createRoot(container);

  const onClose = () => {
    setTimeout(
      () => {
        root.unmount();
        container.parentNode && container.parentNode.removeChild(container);
      },
      delay !== 0 ? delay + 1000 : delay,
    );
  };

  root.render(cloneElement(render, { delay, onClose }));

  return onClose;
}

export default show;
