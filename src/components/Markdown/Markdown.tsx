import { useMemo } from 'react';
import { unified } from 'unified';
import { default as remarkParse } from 'remark-parse';
import { default as remarkGfm } from 'remark-gfm';
import type { Content } from 'mdast';
import { Code, List } from '@mantine/core';
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
    const exclude: Content['type'][] = ['table', 'paragraph', 'list', 'listItem'];
    if ('children' in content && !exclude.includes(content.type)) {
      data.push(...faltten(content.children));
    } else {
      data.push(content);
    }
  }
  return data;
}

function MarkdownComponent({ content, cursor }: MarkdownComponentProps) {
  const renderNodes = (nodes: Content[]) => {
    return (
      <>
        {nodes.map((content, i) => (
          <MarkdownComponent key={i} content={content} cursor={i === nodes.length - 1 && cursor} />
        ))}
      </>
    );
  };

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
    case 'paragraph':
      return <p>{renderNodes(content.children)}</p>;

    case 'list':
      return <List type={content.ordered ? 'ordered' : 'unordered'}>{renderNodes(content.children)}</List>;

    case 'listItem':
      return <List.Item>{renderNodes(content.children)}</List.Item>;
  }

  if ('value' in content) {
    return (
      <span>
        {content.value}
        {cursor}
      </span>
    );
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
