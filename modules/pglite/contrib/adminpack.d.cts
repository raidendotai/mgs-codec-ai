import { P as PGliteInterface } from '../interface-H5dZ9rFy.cjs';
import '../types-BV23hhqY.cjs';

declare const adminpack: {
    name: string;
    setup: (_pg: PGliteInterface, _emscriptenOpts: any) => Promise<{
        bundlePath: URL;
    }>;
};

export { adminpack };
