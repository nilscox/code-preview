import { ESBuildCompiler } from '@code-preview/compiler';
import { Language, PrettierFormatter } from '@code-preview/formatter';
import { CodePreview, MonacoEditor, ReactRoot } from '@code-preview/react';
import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';

// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// @ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

import 'monaco-editor';

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'json') {
      return new jsonWorker();
    }

    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }

    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }

    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }

    return new editorWorker();
  },
};

export default {
  title: 'MonacoEditor',
} satisfies Meta;

const formatter = new PrettierFormatter(Language.typescript);
const compiler = new ESBuildCompiler({ loader: 'tsx' });

const code = `
const MyComponent = (): JSX.Element => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const intervalId = setInterval(() => setCount(count => count + 1), 200);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};
`;

export const Editor: StoryFn = () => (
  <>
    <CodePreview
      style={{ height: 300 }}
      code={code}
      compiler={compiler}
      formatter={formatter}
      editor={(code, onChange) => (
        <MonacoEditor react language="typescript" uri="file:///test.tsx" code={code} onChange={onChange} />
      )}
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
    <CodePreview
      style={{ height: 300 }}
      code={code}
      compiler={compiler}
      formatter={formatter}
      editor={(code, onChange) => (
        <MonacoEditor react language="typescript" uri="file:///test2.tsx" code={code} onChange={onChange} />
      )}
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
  </>
);

Editor.storyName = 'MonacoEditor';
