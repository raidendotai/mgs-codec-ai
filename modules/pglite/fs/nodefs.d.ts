import { F as FilesystemBase, P as PostgresMod, a as FS, D as DumpTarCompressionOptions } from '../types-BV23hhqY.js';

declare class NodeFS extends FilesystemBase {
    protected rootDir: string;
    constructor(dataDir: string);
    emscriptenOpts(opts: Partial<PostgresMod>): Promise<Partial<PostgresMod>>;
    dumpTar(mod: FS, dbname: string, compression?: DumpTarCompressionOptions): Promise<Blob | File>;
    close(FS: FS): Promise<void>;
}

export { NodeFS };
