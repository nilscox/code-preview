import { ESBuildCompiler } from '@code-preview/compiler';
import { Language, PrettierFormatter } from '@code-preview/formatter';
import { CodePreview, ReactRoot } from '@code-preview/react';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'Formatter',
} satisfies Meta;

const formatter = new PrettierFormatter(Language.typescript);
const compiler = new ESBuildCompiler({ loader: 'tsx' });

const code = `
const MyComponent = () =>
{
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() =>
      setCount(count => count + 1),
      200
    );
    return () => clearInterval(intervalId);
  }, []);

  return (<div>
<p>Count: {count}</p>
<button onClick={() => setCount(0)}>Reset</button>
</div>)
};
`;

export const Formatter: StoryFn = () => (
  <CodePreview
    style={{ height: 300 }}
    code={code}
    compiler={compiler}
    formatter={formatter}
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
