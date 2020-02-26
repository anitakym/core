import clx from 'classnames';
import * as React from 'react';

import antdNotification, { ArgsProps } from 'antd/lib/notification';
import 'antd/lib/notification/style/index.css';

import { Button } from '../button';
import * as styles from './nitification.module.less';

enum MessageType {
  Error,
  Warning,
  Info,
  Empty,
}

class Deferred<T> {
  resolve: (value?: T) => void;
  reject: (err?: any) => void; // tslint:disable-line

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

const DURATION: { [type: number]: number } = {
  [MessageType.Info]: 15000,
  [MessageType.Warning]: 18000,
  [MessageType.Error]: 20000,
};

antdNotification.config({
  placement: 'bottomRight',
});

export const notification = antdNotification;

export function open<T = string>(
  message: string | React.ReactNode,
  type: MessageType,
  closable: boolean = true,
  key: string,
  buttons?: string[],
  deferred?: Deferred<T>,
): Promise<T | undefined> | undefined {
  const args: ArgsProps = {
    key,
    className: clx(styles.wrapper, {
      [styles.info]: type === MessageType.Info,
      [styles.error]: type === MessageType.Error,
      [styles.warning]: type === MessageType.Warning,
    }),
    duration: DURATION[type] / 1000,
    onClose: () => deferred?.resolve(),
    btn: buttons ? buttons.map((button, index) => (<Button
      className={clx(styles.button)}
      onClick={() => {
        deferred?.resolve(button as any);
        antdNotification.close(key);
      }}
      key={button}>{button}</Button>)) : null,
    message,
  };

  // closable 为 false 时，不展示 closeIcon
  if (!closable) {
    args.closeIcon = <span />;
  }

  switch (type) {
    case MessageType.Info:
      notification.info(args);
      break;
    case MessageType.Warning:
      notification.warning(args);
      break;
    case MessageType.Error:
      notification.error(args);
      break;
    default:
      notification.open(args);
      break;
  }
  return deferred?.promise;
}
