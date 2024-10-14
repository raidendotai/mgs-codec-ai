type IDBFS = Emscripten.FileSystemType & {
    quit: () => void;
    dbs: Record<string, IDBDatabase>;
};
type FS = typeof FS & {
    filesystems: {
        MEMFS: Emscripten.FileSystemType;
        NODEFS: Emscripten.FileSystemType;
        IDBFS: IDBFS;
    };
    quit: () => void;
};
interface PostgresMod extends Omit<EmscriptenModule, 'preInit' | 'preRun' | 'postRun'> {
    preInit: Array<{
        (mod: PostgresMod): void;
    }>;
    preRun: Array<{
        (mod: PostgresMod): void;
    }>;
    postRun: Array<{
        (mod: PostgresMod): void;
    }>;
    FS: FS;
    WASM_PREFIX: string;
    INITIAL_MEMORY: number;
    pg_extensions: Record<string, Promise<Blob | null>>;
    _pg_initdb: () => number;
    _pg_shutdown: () => void;
    _interactive_write: (msgLength: number) => void;
    _interactive_one: () => void;
    _interactive_read: () => number;
}

type DumpTarCompressionOptions = 'none' | 'gzip' | 'auto';

interface Filesystem {
    /**
     * Returns the options to pass to the emscripten module.
     */
    emscriptenOpts(opts: Partial<PostgresMod>): Promise<Partial<PostgresMod>>;
    /**
     * Sync the filesystem to the emscripten filesystem.
     */
    syncToFs(mod: FS, relaxedDurability?: boolean): Promise<void>;
    /**
     * Sync the emscripten filesystem to the filesystem.
     */
    initialSyncFs(FS: FS): Promise<void>;
    /**
     * Dump the PGDATA dir from the filesystem to a gziped tarball.
     */
    dumpTar(FS: FS, dbname: string, compression?: DumpTarCompressionOptions): Promise<File | Blob>;
    /**
     * Close the filesystem.
     */
    close(FS: FS): Promise<void>;
}
declare abstract class FilesystemBase implements Filesystem {
    protected dataDir?: string;
    constructor(dataDir?: string);
    abstract emscriptenOpts(opts: Partial<PostgresMod>): Promise<Partial<PostgresMod>>;
    syncToFs(_mod: FS, _relaxedDurability?: boolean): Promise<void>;
    initialSyncFs(_mod: FS): Promise<void>;
    abstract dumpTar(mod: FS, dbname: string): Promise<File | Blob>;
    close(_FS: FS): Promise<void>;
}

export { type DumpTarCompressionOptions as D, FilesystemBase as F, type PostgresMod as P, type FS as a, type Filesystem as b };
