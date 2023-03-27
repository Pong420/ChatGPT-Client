import { useMemo } from 'react';
import { unified } from 'unified';
import { default as remarkParse } from 'remark-parse';
import { default as remarkGfm } from 'remark-gfm';
import type { Content } from 'mdast';
import { Code } from '@mantine/core';
import { Prism, type PrismProps } from '@mantine/prism';
import { MarkdownTable } from './MarkdownTable';

export interface MarkdownProps {
  content: string;
  cursor?: React.ReactNode;
}

interface MarkdownComponentProps {
  cursor?: React.ReactNode;
  content: Content;
}

function faltten(content: Content | Content[], data: Content[] = []) {
  if (Array.isArray(content)) {
    content.forEach(t => faltten(t, data));
  } else if ('type' in content) {
    const exclude: Content['type'][] = ['table', 'paragraph'];
    if ('children' in content && !exclude.includes(content.type)) {
      data.push(...faltten(content.children));
    } else {
      data.push(content);
    }
  }
  return data;
}

function MarkdownComponent({ content, cursor }: MarkdownComponentProps) {
  switch (content.type) {
    case 'code':
      return (
        <Prism my="sm" language={content.lang as PrismProps['language']}>
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
    case 'paragraph': {
      const children = content.children;
      return (
        <p>
          {children.map((content, i) => (
            <MarkdownComponent key={i} content={content} cursor={i === children.length - 1 && cursor} />
          ))}
        </p>
      );
    }
  }

  if ('value' in content) {
    return <span>{content.value}{cursor}</span>;
  }

  return null;
}

export function Markdown({ content, cursor }: MarkdownProps) {
  const data = useMemo(() => {
    const ast = unified().use(remarkParse).use(remarkGfm).parse(content);
    return faltten(ast.children);
  }, [content]);

  return (
    <>
      {data.map((content, i) => (
        <MarkdownComponent key={i} content={content} cursor={i === data.length - 1 && cursor} />
      ))}
    </>
  );
}
