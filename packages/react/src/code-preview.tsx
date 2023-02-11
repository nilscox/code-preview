import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Compiler } from '@code-preview/compiler';
import type { Formatter } from '@code-preview/formatter';

type CodePreviewProps = {
  code: string;
  before?: string;
  after?: string;
  editor: (code: string, setCode: (code: string) => void) => React.ReactNode;
  renderer: (code: string) => React.ReactNode;
  showCode?: 'full' | 'compiled';
  compiler?: Compiler;
  formatter?: Formatter;
  className?: string;
  style?: React.CSSProperties;
};

export const CodePreview = ({
  code: initialCode,
  before,
  after,
  editor,
  renderer,
  showCode,
  compiler,
  formatter,
  className,
  style,
}: CodePreviewProps) => {
  const [code, setCode] = useState(initialCode);
  const wholeCode = useMemo(() => [before, code, after].filter(Boolean).join('\n'), [before, code, after]);
  const compiled = useCompileCode(wholeCode, compiler);
  const format = useFormatCode(formatter);

  const editorCode = useMemo(() => {
    if (showCode === 'full') {
      return format(wholeCode);
    } else if (showCode === 'compiled') {
      return compiled;
    }

    return format(code);
  }, [code, wholeCode, compiled, showCode, format]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', ...style }} className={className}>
      {editorCode === undefined ? 'Loading...' : editor(formatter?.format(editorCode) ?? editorCode, setCode)}
      {compiled === undefined ? 'Loading...' : renderer(compiled)}
    </div>
  );
};

const useCompileCode = (code: string, compiler?: Compiler) => {
  const [compiled, setCompiled] = useState<string>();

  useEffect(() => {
    compiler?.initialize();
  }, []);

  useEffect(() => {
    compiler?.compile(code).then(setCompiled);
  }, [code]);

  if (!compiler) {
    return code;
  }

  return compiled;
};

const useFormatCode = (formatter?: Formatter) => {
  return useCallback(
    (code: string) => {
      return formatter?.format(code) ?? code;
    },
    [formatter]
  );
};
