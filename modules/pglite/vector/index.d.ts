import { P as PGliteInterface } from '../interface-BpQch6Qm.js';
import '../types-BV23hhqY.js';

declare const vector: {
    name: string;
    setup: (_pg: PGliteInterface, emscriptenOpts: any) => Promise<{
        emscriptenOpts: any;
        bundlePath: URL;
    }>;
};

export { vector };
