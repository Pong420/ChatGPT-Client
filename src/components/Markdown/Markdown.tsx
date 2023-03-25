import { useMemo } from 'react';
import type { Content } from 'mdast';
import { unified } from 'unified';
import { Code, NavLink } from '@mantine/core';
import { Prism, type PrismProps } from '@mantine/prism';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { MarkdownTable } from './MarkdownTable';

export interface MarkdownProps {
  content: string;
}

function astToRectNode(payload: Content | Content[], data: React.ReactNode[] = []) {
  if (Array.isArray(payload)) {
    payload.forEach(t => astToRectNode(t, data));
  } else if ('type' in payload) {
    data.push(<MarkdownComponent key={data.length} {...payload} />);
  }

  // else if ('children' in payload) {
  //   astToRectNode(payload.children, data);
  // }
  return data;
}

function MarkdownComponent(content: Content) {
  switch (content.type) {
    case 'code':
      return (
        <Prism key={Math.random()} my="sm" language={content.lang as PrismProps['language']}>
          {content.value}
        </Prism>
      );
    case 'inlineCode':
      return (
        <Code color="red" fz="md">
          {content.value}
        </Code>
      );
    case 'table':
      return <MarkdownTable {...content} />;
    case 'link':
      return (
        <a href={content.url} target="_blank">
          {content.url}
        </a>
      );
    case 'paragraph':
      return <p>{astToRectNode(content.children)}</p>;
  }

  if ('children' in content) {
    return <div>{astToRectNode(content.children)}</div>;
  }

  if ('value' in content) {
    return <span>{content.value}</span>;
  }

  return null;
}

export function Markdown({ content }: MarkdownProps) {
  const nodes = useMemo(() => {
    const ast = unified().use(remarkParse).use(remarkGfm).parse(content);
    return astToRectNode(ast.children);
  }, [content]);

  return <>{nodes}</>;
}
