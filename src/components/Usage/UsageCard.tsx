import { createStyles, Text, Paper, Group, rem } from '@mantine/core';
import { IconHexagonLetterP, IconHexagonLetterC, IconHexagonLetterT } from '@tabler/icons-react';

const useStyles = createStyles(theme => ({
  root: {
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor]?.[4] || ''} 0%, ${
      theme.colors[theme.primaryColor]?.[7] || ''
    } 100%)`,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    display: 'flex',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column'
    }
  },

  icon: {
    color: theme.colors[theme.primaryColor]?.[6],
    flex: '0 0 auto'
  },

  stat: {
    minWidth: rem(98),
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.white,
    flex: 1
  },

  label: {
    textTransform: 'uppercase',
    fontWeight: 700,
    fontSize: theme.fontSizes.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily || ''}`,
    color: theme.colors.gray[6],
    lineHeight: 1.2,
    textAlign: 'right'
  },

  value: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    color: theme.black,
    textAlign: 'right'
  },

  month: {
    fontSize: rem(44),
    fontWeight: 700,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center',
    marginBottom: 5,
    fontFamily: `Greycliff CF, ${theme.fontFamily || ''}`
  },

  year: {
    fontSize: theme.fontSizes.sm,
    color: theme.white,
    lineHeight: 1,
    textAlign: 'center'
  },

  left: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 0,
      marginBottom: theme.spacing.xl
    }
  },

  date: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}));

const data = [
  { icon: IconHexagonLetterP, label: 'Prompt' },
  { icon: IconHexagonLetterC, label: 'Completion' },
  { icon: IconHexagonLetterT, label: 'Total' }
];

export interface UsageCardProps {
  year: string;
  month: string;
  tokens: number[];
}

export function UsageCard({ year, month, tokens }: UsageCardProps) {
  const { classes } = useStyles();

  const stats = data.map((stat, i) => (
    <Paper className={classes.stat} radius="md" shadow="md" p="xs" key={stat.label}>
      <Group position="apart" noWrap>
        <stat.icon size={40} className={classes.icon} stroke={1.5} />
        <div>
          <Text className={classes.label}>{stat.label}</Text>
          <Text className={classes.value}>
            {tokens[i]?.toLocaleString('en-US', { style: 'decimal', maximumFractionDigits: 2 }) || 0}
          </Text>
        </div>
      </Group>
    </Paper>
  ));

  return (
    <div className={classes.root}>
      <div className={classes.left}>
        <div className={classes.date}>
          <Text className={classes.month}>{month}</Text>
          <Text className={classes.year}>{year}</Text>
        </div>
      </div>
      <Group sx={{ flex: 1 }} grow>
        {stats}
      </Group>
    </div>
  );
}
