import { Table } from '@mantine/core';

export interface UsageData {
  [x: string]: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export interface UsageTableProps {
  data?: UsageData;
}

function Number({ value = 0, ...props }: React.ComponentProps<'td'> & { value: number }) {
  return <td {...props}>{value.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 })}</td>;
}

export function UsageTable({ data = {} }: UsageTableProps) {
  const rows: React.ReactNode[] = [];

  for (const k in data) {
    const v = data[k];
    if (!v) continue;

    rows.push(
      <tr key={k}>
        <td>{k}</td>
        <Number value={v.prompt} />
        <Number value={v.completion} />
        <Number value={v.total} />
      </tr>
    );
  }

  return (
    <Table striped fontSize="lg" mt="lg">
      <thead>
        <tr>
          <th>Date</th>
          <th>Prompt Tokens</th>
          <th>Completion Tokens</th>
          <th>Total Tokens</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
}
