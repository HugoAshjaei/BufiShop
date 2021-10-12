import { IConfig } from '../intefaces';

declare global {
    namespace CONFIG {
        let website: IConfig;
        let firstTimeUsage: Boolean;
    }
}