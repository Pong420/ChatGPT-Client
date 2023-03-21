import { Stack } from '@mantine/core';

export interface MenuModalSectionProps {
  children?: React.ReactNode;
}

export function MenuModalSection({ children }: MenuModalSectionProps) {
  return (
    <Stack spacing={2} bg="hsla(0,0%,100%,0.15)">
      {children}
    </Stack>
  );
}
