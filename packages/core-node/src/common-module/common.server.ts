import { Injectable } from '@opensumi/di';
import { ICommonServer, OS } from '@opensumi/ide-core-common';

@Injectable()
export class CommonServer implements ICommonServer {
  async getBackendOS(): Promise<OS.Type> {
    return OS.type();
  }
}
