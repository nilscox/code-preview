import * as esbuild from 'esbuild-wasm';

export interface Compiler {
  initialize(): Promise<void>;
  compile(code: string): Promise<string>;
}

export class ESBuildCompiler implements Compiler {
  private static initState: 'not-started' | 'in-progress' | 'done' = 'not-started';

  constructor(private readonly options?: esbuild.TransformOptions) {}

  async initialize() {
    if (ESBuildCompiler.initState === 'not-started') {
      ESBuildCompiler.initState = 'in-progress';
      await esbuild.initialize({ wasmURL: '/esbuild.wasm' });
      ESBuildCompiler.initState = 'done';
    }

    while (ESBuildCompiler.initState !== 'done') {
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  async compile(code: string): Promise<string> {
    await this.initialize();

    const result = await esbuild.transform(code, this.options);

    return result.code;
  }
}
