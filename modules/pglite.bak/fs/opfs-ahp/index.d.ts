import { F as FilesystemBase, P as PostgresMod, a as FS, D as DumpTarCompressionOptions } from '../../types-BV23hhqY.js';

type FsStats = {
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atime: number;
    mtime: number;
    ctime: number;
};
interface State {
    root: DirectoryNode;
    pool: PoolFilenames;
}
type PoolFilenames = Array<string>;
type NodeType = 'file' | 'directory';
interface BaseNode {
    type: NodeType;
    lastModified: number;
    mode: number;
}
interface FileNode extends BaseNode {
    type: 'file';
    backingFilename: string;
}
interface DirectoryNode extends BaseNode {
    type: 'directory';
    children: {
        [filename: string]: Node;
    };
}
type Node = FileNode | DirectoryNode;

interface OpfsAhpOptions {
    root: string;
    initialPoolSize?: number;
    maintainedPoolSize?: number;
}
/**
 * An OPFS Access Handle Pool VFS that exports a Node.js-like FS interface.
 * This FS is then wrapped by an Emscripten FS interface in emscriptenFs.ts.
 */
declare class OpfsAhp {
    #private;
    readyPromise: Promise<void>;
    readonly root: string;
    readonly initialPoolSize: number;
    readonly maintainedPoolSize: number;
    state: State;
    lastCheckpoint: number;
    checkpointInterval: number;
    poolCounter: number;
    constructor({ root, initialPoolSize, maintainedPoolSize }: OpfsAhpOptions);
    static create(options: OpfsAhpOptions): Promise<OpfsAhp>;
    get ready(): boolean;
    maintainPool(size?: number): Promise<void>;
    _createPoolFileState(filename: string): void;
    _deletePoolFileState(filename: string): void;
    maybeCheckpointState(): Promise<void>;
    checkpointState(): Promise<void>;
    flush(): void;
    exit(): void;
    chmod(path: string, mode: number): void;
    _chmodState(path: string, mode: number): void;
    close(fd: number): void;
    fstat(fd: number): FsStats;
    lstat(path: string): FsStats;
    mkdir(path: string, options?: {
        recursive?: boolean;
        mode?: number;
    }): void;
    _mkdirState(path: string, options?: {
        recursive?: boolean;
        mode?: number;
    }): void;
    open(path: string, _flags?: string, _mode?: number): number;
    readdir(path: string): string[];
    read(fd: number, buffer: Int8Array, // Buffer to read into
    offset: number, // Offset in buffer to start writing to
    length: number, // Number of bytes to read
    position: number): number;
    rename(oldPath: string, newPath: string): void;
    _renameState(oldPath: string, newPath: string, doFileOps?: boolean): void;
    rmdir(path: string): void;
    _rmdirState(path: string): void;
    truncate(path: string, len?: number): void;
    unlink(path: string): void;
    _unlinkState(path: string, doFileOps?: boolean): void;
    utimes(path: string, atime: number, mtime: number): void;
    _utimesState(path: string, _atime: number, mtime: number): void;
    writeFile(path: string, data: string | Int8Array, options?: {
        encoding?: string;
        mode?: number;
        flag?: string;
    }): void;
    _createFileNodeState(path: string, node: FileNode): FileNode;
    _setLastModifiedState(path: string, lastModified: number): void;
    write(fd: number, buffer: Int8Array, // Buffer to read from
    offset: number, // Offset in buffer to start reading from
    length: number, // Number of bytes to write
    position: number): number;
}

interface OpfsAhpFSOptions {
    initialPoolSize?: number;
    maintainedPoolSize?: number;
}
/**
 * PGlite OPFS access handle pool filesystem.
 * Opens a pool of sync access handles and then allocates them as needed.
 */
declare class OpfsAhpFS extends FilesystemBase {
    #private;
    opfsAhp?: OpfsAhp;
    constructor(dataDir: string, { initialPoolSize, maintainedPoolSize }?: OpfsAhpFSOptions);
    emscriptenOpts(opts: Partial<PostgresMod>): Promise<Partial<PostgresMod>>;
    syncToFs(_fs: FS, relaxedDurability?: boolean): Promise<void>;
    dumpTar(mod: FS, dbname: string, compression?: DumpTarCompressionOptions): Promise<Blob | File>;
    close(FS: FS): Promise<void>;
}

export { OpfsAhpFS, type OpfsAhpFSOptions };
