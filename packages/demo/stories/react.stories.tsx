import { ESBuildCompiler } from '@code-preview/compiler';
import { CodePreview, ReactRoot } from '@code-preview/react';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

export default {
  title: 'React Code Preview',
} satisfies Meta;

const reactCode = `
type MyComponentProps = {
  initialValue: number;
  increment: number;
  interval: number;
}

const MyComponent = ({ initialValue, increment, interval }: MyComponentProps) => {
  const [count, setCount] = React.useState(initialValue);

  React.useEffect(() => {
    const intervalId = setInterval(() => setCount(count => count + increment), interval);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
`.trimStart();

const compiler = new ESBuildCompiler({ loader: 'tsx' });

type Args = {
  initialValue: number;
  increment: number;
  interval: number;
};

export const ReactCodePreview: StoryFn<Args> = (args) => (
  <CodePreview
    style={{ height: 420 }}
    code={reactCode}
    compiler={compiler}
    editor={(code, onChange) => <textarea value={code} onChange={(event) => onChange(event.target.value)} />}
    renderer={(code) => (
      <ReactRoot
        component="MyComponent"
        props={args}
        code={code}
        style={{ border: '0' }}
        iframeStyle={{ padding: '0 16px' }}
      />
    )}
    className="code-preview"
  />
);

ReactCodePreview.args = {
  initialValue: 0,
  increment: 1,
  interval: 200,
};
