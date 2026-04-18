/**
 * CommonMark/GFM：列表项下一行若是围栏代码 ```，中间必须有空行，
 * 否则围栏不会成为独立代码块，代码会变成列表里的段落文本。
 */
export function normalizeMarkdownForCodeFences(markdown: string): string {
  return markdown.replace(
    /(^|\n)((?:[ \t]*)(?:(?:\d+\.)|[*+-])[ \t]+[^\n]+)\n([ \t]*```[^\n]*\n)/g,
    "$1$2\n\n$3"
  );
}
