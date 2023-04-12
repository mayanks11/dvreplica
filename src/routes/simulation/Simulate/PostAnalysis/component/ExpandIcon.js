import * as React from 'react';

const ExpandIcon = (props) => (
  <svg
    viewBox="0 0 32 32"
    id="icon"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <style>{'.cls-1{fill:none;}'}</style>
    </defs>
    {/* <title>{'expand-categories'}</title> */}
    <rect x={20} y={26} width={6} height={2} />
    <rect x={20} y={18} width={8} height={2} />
    <rect x={20} y={10} width={10} height={2} />
    <rect x={15} y={4} width={2} height={24} />
    <polygon points="10.586 3.959 7 7.249 3.412 3.958 2 5.373 7 10 12 5.373 10.586 3.959" />
    <rect
      id="_Transparent_Rectangle_"
      data-name="&lt;Transparent Rectangle&gt;"
      className="cls-1"
      width={32}
      height={32}
    />
  </svg>
);

export default ExpandIcon;
