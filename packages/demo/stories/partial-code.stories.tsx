import { ESBuildCompiler } from '@code-preview/compiler';
import { CodePreview, ReactRoot } from '@code-preview/react';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'Partial Code',
} satisfies Meta;

const compiler = new ESBuildCompiler({ loader: 'tsx' });

export const PartialCode: StoryFn = () => (
  <CodePreview
    style={{ height: 200 }}
    before={`
const MyComponent = () => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => setCount(count => count + 1), 200);
    return () => clearInterval(intervalId);
  }, []);

  return (
    `}
    code={`
<div>
  <p>Count: {count}</p>
  <button onClick={() => setCount(0)}>Reset</button>
</div>
`.trimStart()}
    after={`
  )
};
    `}
    compiler={compiler}
    editor={(code, onChange) => <textarea value={code} onChange={(event) => onChange(event.target.value)} />}
    renderer={(code) => (
      <ReactRoot
        component="MyComponent"
        code={code}
        style={{ border: '0' }}
        iframeStyle={{ padding: '0 16px' }}
      />
    )}
    className="code-preview"
  />
);
