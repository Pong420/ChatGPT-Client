import { createElement } from 'react';
import { type NotificationProps } from '@mantine/core';
import { notifications as n } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

export const notifications = {
  ...n,
  error(message: string, payload?: NotificationProps) {
    this.show({ ...payload, message, color: 'red', icon: createElement(IconX, { size: '1.2rem' }) });
  }
};
