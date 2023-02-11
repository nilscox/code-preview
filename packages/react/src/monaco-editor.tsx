import loader, { type Monaco } from '@monaco-editor/loader';
import * as monacoImpl from 'monaco-editor';
import { useEffect, useState } from 'react';

import reactDefinitions from './react.d.txt';

monacoImpl.languages.typescript.typescriptDefaults.setEagerModelSync(true);

type MonacoEditorProps = {
  code: string;
  onChange: (code: string) => void;
  react?: boolean;
  language?: string;
  uri?: string;
  className?: string;
};

export const MonacoEditor = ({ code, onChange, react, language, uri, className }: MonacoEditorProps) => {
  const [monaco, setMonaco] = useState<Monaco>();
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    loader.config({ monaco: monacoImpl });
    loader.init().then(setMonaco);
  }, []);

  useEffect(() => {
    if (!ref || !monaco) {
      return;
    }

    if (react) {
      setupReact(monaco);
    }

    const model = monaco.editor.createModel(code, language, uri ? monaco.Uri.parse(uri) : undefined);

    const editor = monaco.editor.create(ref, {
      model,
      language,
      automaticLayout: true,
      fontSize: 12,
      parameterHints: { enabled: true },
      minimap: { enabled: false },
      codeLens: false,
      overviewRulerBorder: false,
      scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
      lineNumbersMinChars: 3,
      renderLineHighlight: 'none',
      scrollBeyondLastLine: false,
      contextmenu: false,
    });

    editor.onDidChangeModelContent(() => onChange(model.getValue()));

    return () => {
      model.dispose();
      editor.dispose();
    };
  }, [ref, monaco]);

  return <div ref={setRef} className={className} />;
};

// Thanks! https://github.com/microsoft/monaco-editor/issues/264#issuecomment-654578687
const setupReact = (monaco: Monaco) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types'],
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactDefinitions,
    'file:///node_modules/@react/types/index.d.ts'
  );
};
