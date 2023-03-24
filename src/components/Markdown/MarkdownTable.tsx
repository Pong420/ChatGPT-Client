import { Fragment, createElement } from 'react';
import { Table } from '@mantine/core';
import type { Table as TableData, TableCell } from 'mdast';

function Cell({ data, tag }: { data?: TableCell; tag: 'th' | 'td' }) {
  const content = data?.children.map((c, k) => (
    <Fragment key={k}>{'value' in c ? (c.value as React.ReactNode) : `Uknown Type ${c.type}`}</Fragment>
  ));
  return createElement(tag, {}, content);
}

export function MarkdownTable({ children = [] }: TableData) {
  const [headers, ...rows] = children;

  return (
    <Table striped withBorder my="lg">
      <thead>
        <tr>
          {headers?.children.map((r, i) => (
            <Cell key={i} tag="th" data={r} />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((data, r) => (
          <tr key={r}>
            {data?.children.map((r, i) => (
              <Cell key={i} tag="td" data={r} />
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
