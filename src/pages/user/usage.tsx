import { useState } from 'react';
import { Container, Title } from '@mantine/core';
import type { CreateCompletionResponseUsage } from 'openai';
import type { NextPageWithLayout } from '@/pages/_app';
import { getLayout } from '@/components/Layout/Layout';
import { type UsageData, UsageTable } from '@/components/Usage/UsageTable';
import { api } from '@/utils/api';
import dayjs from 'dayjs';

const UsagePage: NextPageWithLayout = () => {
  const [{ dateRange }] = useState(() => {
    const currentMonth = dayjs().endOf('month');
    const previousYears = dayjs().subtract(1, 'year').add(1, 'month').endOf('month');
    return {
      dateRange: { from: previousYears.toDate(), to: currentMonth.toDate() },
      dateRangeStr: { from: previousYears.format('YYYY-MM'), to: currentMonth.format('YYYY-MM') }
    };
  });

  const usages = api.usage.all.useQuery(dateRange, {
    select: data => {
      const output: UsageData = {};
      const dateToKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      const from = new Date(dateRange.from);
      for (let d = new Date(dateRange.to); d > from; d.setMonth(d.getMonth() - 1)) {
        output[dateToKey(d)] = { prompt: 0, completion: 0, total: 0 };
      }

      for (const d of data) {
        const k = dateToKey(d.createdAt);
        const v = output[k];
        if (!v) throw new Error('bad implementation');

        const usage = d.data as unknown as CreateCompletionResponseUsage;

        output[k] = {
          ...v,
          prompt: v.prompt + usage.prompt_tokens,
          completion: v.completion + usage.completion_tokens,
          total: v.total + usage.completion_tokens
        };
      }

      return output;
    }
  });

  const data = usages.data;

  return (
    <Container py="lg">
      <Title>Tokens Used</Title>
      <UsageTable data={data} />
    </Container>
  );
};

UsagePage.getLayout = getLayout;

export default UsagePage;
