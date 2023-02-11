import { CodePreview, HtmlRoot } from '@code-preview/react';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'HTML Code Preview',
} satisfies Meta;

const svgCode = `
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 -1 4 4"
  width="100%"
  height="200"
>
  <path fill="#0006" d="M 0 0 L 2 -1 L 4 0 L 2 1 Z" />
  <path fill="#0003" d="M 0 0 L 2 1 L 2 3 L 0 2 Z" />
  <path fill="#0009" d="M 4 0 L 2 1 L 2 3 L 4 2 Z" />
</svg>
`.trimStart();

export const HTMLCodePreview: StoryFn = () => (
  <CodePreview
    style={{ height: 300 }}
    code={svgCode}
    editor={(code, onChange) => <textarea value={code} onChange={(event) => onChange(event.target.value)} />}
    renderer={(code) => (
      <HtmlRoot
        code={code}
        style={{ border: 0 }}
        iframeStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      />
    )}
    className="code-preview"
  />
);
