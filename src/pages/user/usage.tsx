import { useState } from 'react';
import { Container, Stack, Title } from '@mantine/core';
import type { Usage } from '@prisma/client';
import type { CreateCompletionResponseUsage } from 'openai';
import type { NextPageWithLayout } from '@/pages/_app';
import { getLayout } from '@/components/Layout/Layout';
import { UsageCard } from '@/components/Usage/UsageCard';
import { api } from '@/utils/api';
import dayjs from 'dayjs';

type Data = Record<string, Record<string, Usage[]>>;

const UsagePage: NextPageWithLayout = () => {
  const [{ dateRange, dateRangeStr }] = useState(() => {
    const currentMonth = dayjs().endOf('month');
    const previousYears = dayjs().subtract(1, 'year').add(1, 'month').endOf('month');
    return {
      dateRange: { from: previousYears.toDate(), to: currentMonth.toDate() },
      dateRangeStr: { from: previousYears.format('YYYY-MM'), to: currentMonth.format('YYYY-MM') }
    };
  });

  const usages = api.usage.all.useQuery(dateRange, {
    select: data => {
      const output: Data = {};

      for (const d of data) {
        const [, year = '', month = ''] = d.createdAt.toISOString().match(/(\d+)-(\d+)-(\d+)/) || [];
        output[year] = output[year] || {};
        output[year][month] = output[year][month] || [];
        output[year][month].push(d);
      }

      return output;
    }
  });
  const data = usages.data || {};
  const cards: React.ReactNode[] = [];

  for (const year in data) {
    const datasets = data[year] || {};
    for (const month in datasets) {
      const monthly = datasets[month] || [];
      let [prompt, completion, total] = [0, 0, 0];
      for (const dd of monthly) {
        const d = dd.data as unknown as CreateCompletionResponseUsage;
        prompt += d.prompt_tokens;
        completion += d.completion_tokens;
        total += d.total_tokens;
      }
      cards.push(<UsageCard key={`${year}-${month}`} year={year} month={month} tokens={[prompt, completion, total]} />);
    }
  }

  return (
    <Container py="lg">
      <Title>
        Usage from {dateRangeStr.from} to {dateRangeStr.to}
      </Title>
      <Stack mt="lg">{cards}</Stack>
    </Container>
  );
};

UsagePage.getLayout = getLayout;

export default UsagePage;
