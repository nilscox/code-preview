import * as prettier from 'prettier';
import parserHtml from 'prettier/esm/parser-html';
import parserTypescript from 'prettier/esm/parser-typescript';

export enum Language {
  html = 'html',
  typescript = 'typescript',
}

export interface Formatter {
  format(code: string): string;
}

export class PrettierFormatter implements Formatter {
  static parsers: Record<Language, prettier.Plugin> = {
    [Language.html]: parserHtml,
    [Language.typescript]: parserTypescript,
  };

  constructor(private language: Language, private options?: prettier.Options) {}

  format(code: string): string {
    const parser = PrettierFormatter.parsers[this.language];

    try {
      const formatted = prettier.format(code, {
        parser: this.language,
        plugins: [parser],
        ...this.options,
      });

      return formatted.replace(/^;/, '');
    } catch {
      return code;
    }
  }
}
