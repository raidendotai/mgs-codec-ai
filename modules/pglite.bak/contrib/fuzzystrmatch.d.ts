import { P as PGliteInterface } from '../interface-BpQch6Qm.js';
import '../types-BV23hhqY.js';

declare const fuzzystrmatch: {
    name: string;
    setup: (_pg: PGliteInterface, _emscriptenOpts: any) => Promise<{
        bundlePath: URL;
    }>;
};

export { fuzzystrmatch };
