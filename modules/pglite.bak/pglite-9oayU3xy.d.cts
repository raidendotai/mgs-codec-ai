import { b as Filesystem, P as PostgresMod, D as DumpTarCompressionOptions } from './types-BV23hhqY.cjs';
import { c as ParserOptions, P as PGliteInterface, D as DebugLevel, E as ExecProtocolOptions, B as BackendMessage, Q as QueryOptions, R as Results, T as Transaction, i as PGliteOptions, j as PGliteInterfaceExtensions } from './interface-H5dZ9rFy.cjs';

declare const BOOL = 16;
declare const BYTEA = 17;
declare const CHAR = 18;
declare const INT8 = 20;
declare const INT2 = 21;
declare const INT4 = 23;
declare const REGPROC = 24;
declare const TEXT = 25;
declare const OID = 26;
declare const TID = 27;
declare const XID = 28;
declare const CID = 29;
declare const JSON = 114;
declare const XML = 142;
declare const PG_NODE_TREE = 194;
declare const SMGR = 210;
declare const PATH = 602;
declare const POLYGON = 604;
declare const CIDR = 650;
declare const FLOAT4 = 700;
declare const FLOAT8 = 701;
declare const ABSTIME = 702;
declare const RELTIME = 703;
declare const TINTERVAL = 704;
declare const CIRCLE = 718;
declare const MACADDR8 = 774;
declare const MONEY = 790;
declare const MACADDR = 829;
declare const INET = 869;
declare const ACLITEM = 1033;
declare const BPCHAR = 1042;
declare const VARCHAR = 1043;
declare const DATE = 1082;
declare const TIME = 1083;
declare const TIMESTAMP = 1114;
declare const TIMESTAMPTZ = 1184;
declare const INTERVAL = 1186;
declare const TIMETZ = 1266;
declare const BIT = 1560;
declare const VARBIT = 1562;
declare const NUMERIC = 1700;
declare const REFCURSOR = 1790;
declare const REGPROCEDURE = 2202;
declare const REGOPER = 2203;
declare const REGOPERATOR = 2204;
declare const REGCLASS = 2205;
declare const REGTYPE = 2206;
declare const UUID = 2950;
declare const TXID_SNAPSHOT = 2970;
declare const PG_LSN = 3220;
declare const PG_NDISTINCT = 3361;
declare const PG_DEPENDENCIES = 3402;
declare const TSVECTOR = 3614;
declare const TSQUERY = 3615;
declare const GTSVECTOR = 3642;
declare const REGCONFIG = 3734;
declare const REGDICTIONARY = 3769;
declare const JSONB = 3802;
declare const REGNAMESPACE = 4089;
declare const REGROLE = 4096;
declare const types: {
    string: {
        to: number;
        from: number[];
        serialize: (x: string | number) => string;
        parse: (x: string) => string;
    };
    number: {
        to: number;
        from: number[];
        serialize: (x: number) => string;
        parse: (x: string) => number;
    };
    bigint: {
        to: number;
        from: number[];
        serialize: (x: bigint) => string;
        parse: (x: string) => number | bigint;
    };
    json: {
        to: number;
        from: number[];
        serialize: (x: any) => string;
        parse: (x: string) => any;
    };
    boolean: {
        to: number;
        from: number[];
        serialize: (x: boolean) => "t" | "f";
        parse: (x: string) => x is "t";
    };
    date: {
        to: number;
        from: number[];
        serialize: (x: Date | string | number) => string;
        parse: (x: string | number) => Date;
    };
    bytea: {
        to: number;
        from: number[];
        serialize: (x: Uint8Array) => string;
        parse: (x: string) => Uint8Array;
    };
};
type Parser = (x: string, typeId?: number) => any;
type Serializer = (x: any) => string;
type TypeHandler = {
    to: number;
    from: number | number[];
    serialize: Serializer;
    parse: Parser;
};
type TypeHandlers = {
    [key: string]: TypeHandler;
};
declare const parsers: {
    [key: string]: (x: string, typeId?: number) => any;
    [key: number]: (x: string, typeId?: number) => any;
};
declare const serializers: {
    [key: string]: Serializer;
    [key: number]: Serializer;
};
declare function parseType(x: string | null, type: number, parsers?: ParserOptions): any;
declare function arraySerializer(xs: any, serializer: Serializer | undefined, typarray: number): string;
declare function arrayParser(x: string, parser: Parser, typarray: number): any;

declare const types$1_ABSTIME: typeof ABSTIME;
declare const types$1_ACLITEM: typeof ACLITEM;
declare const types$1_BIT: typeof BIT;
declare const types$1_BOOL: typeof BOOL;
declare const types$1_BPCHAR: typeof BPCHAR;
declare const types$1_BYTEA: typeof BYTEA;
declare const types$1_CHAR: typeof CHAR;
declare const types$1_CID: typeof CID;
declare const types$1_CIDR: typeof CIDR;
declare const types$1_CIRCLE: typeof CIRCLE;
declare const types$1_DATE: typeof DATE;
declare const types$1_FLOAT4: typeof FLOAT4;
declare const types$1_FLOAT8: typeof FLOAT8;
declare const types$1_GTSVECTOR: typeof GTSVECTOR;
declare const types$1_INET: typeof INET;
declare const types$1_INT2: typeof INT2;
declare const types$1_INT4: typeof INT4;
declare const types$1_INT8: typeof INT8;
declare const types$1_INTERVAL: typeof INTERVAL;
declare const types$1_JSON: typeof JSON;
declare const types$1_JSONB: typeof JSONB;
declare const types$1_MACADDR: typeof MACADDR;
declare const types$1_MACADDR8: typeof MACADDR8;
declare const types$1_MONEY: typeof MONEY;
declare const types$1_NUMERIC: typeof NUMERIC;
declare const types$1_OID: typeof OID;
declare const types$1_PATH: typeof PATH;
declare const types$1_PG_DEPENDENCIES: typeof PG_DEPENDENCIES;
declare const types$1_PG_LSN: typeof PG_LSN;
declare const types$1_PG_NDISTINCT: typeof PG_NDISTINCT;
declare const types$1_PG_NODE_TREE: typeof PG_NODE_TREE;
declare const types$1_POLYGON: typeof POLYGON;
type types$1_Parser = Parser;
declare const types$1_REFCURSOR: typeof REFCURSOR;
declare const types$1_REGCLASS: typeof REGCLASS;
declare const types$1_REGCONFIG: typeof REGCONFIG;
declare const types$1_REGDICTIONARY: typeof REGDICTIONARY;
declare const types$1_REGNAMESPACE: typeof REGNAMESPACE;
declare const types$1_REGOPER: typeof REGOPER;
declare const types$1_REGOPERATOR: typeof REGOPERATOR;
declare const types$1_REGPROC: typeof REGPROC;
declare const types$1_REGPROCEDURE: typeof REGPROCEDURE;
declare const types$1_REGROLE: typeof REGROLE;
declare const types$1_REGTYPE: typeof REGTYPE;
declare const types$1_RELTIME: typeof RELTIME;
declare const types$1_SMGR: typeof SMGR;
type types$1_Serializer = Serializer;
declare const types$1_TEXT: typeof TEXT;
declare const types$1_TID: typeof TID;
declare const types$1_TIME: typeof TIME;
declare const types$1_TIMESTAMP: typeof TIMESTAMP;
declare const types$1_TIMESTAMPTZ: typeof TIMESTAMPTZ;
declare const types$1_TIMETZ: typeof TIMETZ;
declare const types$1_TINTERVAL: typeof TINTERVAL;
declare const types$1_TSQUERY: typeof TSQUERY;
declare const types$1_TSVECTOR: typeof TSVECTOR;
declare const types$1_TXID_SNAPSHOT: typeof TXID_SNAPSHOT;
type types$1_TypeHandler = TypeHandler;
type types$1_TypeHandlers = TypeHandlers;
declare const types$1_UUID: typeof UUID;
declare const types$1_VARBIT: typeof VARBIT;
declare const types$1_VARCHAR: typeof VARCHAR;
declare const types$1_XID: typeof XID;
declare const types$1_XML: typeof XML;
declare const types$1_arrayParser: typeof arrayParser;
declare const types$1_arraySerializer: typeof arraySerializer;
declare const types$1_parseType: typeof parseType;
declare const types$1_parsers: typeof parsers;
declare const types$1_serializers: typeof serializers;
declare const types$1_types: typeof types;
declare namespace types$1 {
  export { types$1_ABSTIME as ABSTIME, types$1_ACLITEM as ACLITEM, types$1_BIT as BIT, types$1_BOOL as BOOL, types$1_BPCHAR as BPCHAR, types$1_BYTEA as BYTEA, types$1_CHAR as CHAR, types$1_CID as CID, types$1_CIDR as CIDR, types$1_CIRCLE as CIRCLE, types$1_DATE as DATE, types$1_FLOAT4 as FLOAT4, types$1_FLOAT8 as FLOAT8, types$1_GTSVECTOR as GTSVECTOR, types$1_INET as INET, types$1_INT2 as INT2, types$1_INT4 as INT4, types$1_INT8 as INT8, types$1_INTERVAL as INTERVAL, types$1_JSON as JSON, types$1_JSONB as JSONB, types$1_MACADDR as MACADDR, types$1_MACADDR8 as MACADDR8, types$1_MONEY as MONEY, types$1_NUMERIC as NUMERIC, types$1_OID as OID, types$1_PATH as PATH, types$1_PG_DEPENDENCIES as PG_DEPENDENCIES, types$1_PG_LSN as PG_LSN, types$1_PG_NDISTINCT as PG_NDISTINCT, types$1_PG_NODE_TREE as PG_NODE_TREE, types$1_POLYGON as POLYGON, type types$1_Parser as Parser, types$1_REFCURSOR as REFCURSOR, types$1_REGCLASS as REGCLASS, types$1_REGCONFIG as REGCONFIG, types$1_REGDICTIONARY as REGDICTIONARY, types$1_REGNAMESPACE as REGNAMESPACE, types$1_REGOPER as REGOPER, types$1_REGOPERATOR as REGOPERATOR, types$1_REGPROC as REGPROC, types$1_REGPROCEDURE as REGPROCEDURE, types$1_REGROLE as REGROLE, types$1_REGTYPE as REGTYPE, types$1_RELTIME as RELTIME, types$1_SMGR as SMGR, type types$1_Serializer as Serializer, types$1_TEXT as TEXT, types$1_TID as TID, types$1_TIME as TIME, types$1_TIMESTAMP as TIMESTAMP, types$1_TIMESTAMPTZ as TIMESTAMPTZ, types$1_TIMETZ as TIMETZ, types$1_TINTERVAL as TINTERVAL, types$1_TSQUERY as TSQUERY, types$1_TSVECTOR as TSVECTOR, types$1_TXID_SNAPSHOT as TXID_SNAPSHOT, type types$1_TypeHandler as TypeHandler, type types$1_TypeHandlers as TypeHandlers, types$1_UUID as UUID, types$1_VARBIT as VARBIT, types$1_VARCHAR as VARCHAR, types$1_XID as XID, types$1_XML as XML, types$1_arrayParser as arrayParser, types$1_arraySerializer as arraySerializer, types$1_parseType as parseType, types$1_parsers as parsers, types$1_serializers as serializers, types$1_types as types };
}

declare abstract class BasePGlite implements Pick<PGliteInterface, 'query' | 'sql' | 'exec' | 'transaction'> {
    #private;
    serializers: Record<number | string, Serializer>;
    parsers: Record<number | string, Parser>;
    abstract debug: DebugLevel;
    /**
     * Execute a postgres wire protocol message
     * @param message The postgres wire protocol message to execute
     * @returns The result of the query
     */
    abstract execProtocol(message: Uint8Array, { syncToFs, onNotice }: ExecProtocolOptions): Promise<Array<[BackendMessage, Uint8Array]>>;
    /**
     * Execute a postgres wire protocol message directly without wrapping the response.
     * Only use if `execProtocol()` doesn't suite your needs.
     *
     * **Warning:** This bypasses PGlite's protocol wrappers that manage error/notice messages,
     * transactions, and notification listeners. Only use if you need to bypass these wrappers and
     * don't intend to use the above features.
     *
     * @param message The postgres wire protocol message to execute
     * @returns The direct message data response produced by Postgres
     */
    abstract execProtocolRaw(message: Uint8Array, { syncToFs }: ExecProtocolOptions): Promise<Uint8Array>;
    /**
     * Sync the database to the filesystem
     * @returns Promise that resolves when the database is synced to the filesystem
     */
    abstract syncToFs(): Promise<void>;
    /**
     * Handle a file attached to the current query
     * @param file The file to handle
     */
    abstract _handleBlob(blob?: File | Blob): Promise<void>;
    /**
     * Get the written file
     */
    abstract _getWrittenBlob(): Promise<File | Blob | undefined>;
    /**
     * Cleanup the current file
     */
    abstract _cleanupBlob(): Promise<void>;
    abstract _checkReady(): Promise<void>;
    abstract _runExclusiveQuery<T>(fn: () => Promise<T>): Promise<T>;
    abstract _runExclusiveTransaction<T>(fn: () => Promise<T>): Promise<T>;
    /**
     * Initialize the array types
     * The oid if the type of an element and the typarray is the oid of the type of the
     * array.
     * We extract these from the databaes then create the serializers/parsers for
     * each type.
     * This should be called at the end of #init() in the implementing class.
     */
    _initArrayTypes(): Promise<void>;
    /**
     * Execute a single SQL statement
     * This uses the "Extended Query" postgres wire protocol message.
     * @param query The query to execute
     * @param params Optional parameters for the query
     * @returns The result of the query
     */
    query<T>(query: string, params?: any[], options?: QueryOptions): Promise<Results<T>>;
    /**
     * Execute a single SQL statement like with {@link PGlite.query}, but with a
     * templated statement where template values will be treated as parameters.
     *
     * You can use helpers from `/template` to further format the query with
     * identifiers, raw SQL, and nested statements.
     *
     * This uses the "Extended Query" postgres wire protocol message.
     *
     * @param query The query to execute with parameters as template values
     * @returns The result of the query
     *
     * @example
     * ```ts
     * const results = await db.sql`SELECT * FROM ${identifier`foo`} WHERE id = ${id}`
     * ```
     */
    sql<T>(sqlStrings: TemplateStringsArray, ...params: any[]): Promise<Results<T>>;
    /**
     * Execute a SQL query, this can have multiple statements.
     * This uses the "Simple Query" postgres wire protocol message.
     * @param query The query to execute
     * @returns The result of the query
     */
    exec(query: string, options?: QueryOptions): Promise<Array<Results>>;
    /**
     * Execute a transaction
     * @param callback A callback function that takes a transaction object
     * @returns The result of the transaction
     */
    transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T | undefined>;
}

declare class PGlite extends BasePGlite implements PGliteInterface, AsyncDisposable {
    #private;
    fs?: Filesystem;
    protected mod?: PostgresMod;
    readonly dataDir?: string;
    readonly waitReady: Promise<void>;
    readonly debug: DebugLevel;
    /**
     * Create a new PGlite instance
     * @param dataDir The directory to store the database files
     *                Prefix with idb:// to use indexeddb filesystem in the browser
     *                Use memory:// to use in-memory filesystem
     * @param options PGlite options
     */
    constructor(dataDir?: string, options?: PGliteOptions);
    /**
     * Create a new PGlite instance
     * @param options PGlite options including the data directory
     */
    constructor(options?: PGliteOptions);
    /**
     * Create a new PGlite instance with extensions on the Typescript interface
     * (The main constructor does enable extensions, however due to the limitations
     * of Typescript, the extensions are not available on the instance interface)
     * @param options PGlite options including the data directory
     * @returns A promise that resolves to the PGlite instance when it's ready.
     */
    static create<O extends PGliteOptions>(options?: O): Promise<PGlite & PGliteInterfaceExtensions<O['extensions']>>;
    /**
     * Create a new PGlite instance with extensions on the Typescript interface
     * (The main constructor does enable extensions, however due to the limitations
     * of Typescript, the extensions are not available on the instance interface)
     * @param dataDir The directory to store the database files
     *                Prefix with idb:// to use indexeddb filesystem in the browser
     *                Use memory:// to use in-memory filesystem
     * @param options PGlite options
     * @returns A promise that resolves to the PGlite instance when it's ready.
     */
    static create<O extends PGliteOptions>(dataDir?: string, options?: O): Promise<PGlite & PGliteInterfaceExtensions<O['extensions']>>;
    /**
     * The Postgres Emscripten Module
     */
    get Module(): PostgresMod;
    /**
     * The ready state of the database
     */
    get ready(): boolean;
    /**
     * The closed state of the database
     */
    get closed(): boolean;
    /**
     * Close the database
     * @returns A promise that resolves when the database is closed
     */
    close(): Promise<void>;
    /**
     * Close the database when the object exits scope
     * Stage 3 ECMAScript Explicit Resource Management
     * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management
     */
    [Symbol.asyncDispose](): Promise<void>;
    /**
     * Handle a file attached to the current query
     * @param file The file to handle
     */
    _handleBlob(blob?: File | Blob): Promise<void>;
    /**
     * Cleanup the current file
     */
    _cleanupBlob(): Promise<void>;
    /**
     * Get the written blob from the current query
     * @returns The written blob
     */
    _getWrittenBlob(): Promise<Blob | undefined>;
    /**
     * Wait for the database to be ready
     */
    _checkReady(): Promise<void>;
    /**
     * Execute a postgres wire protocol message directly without wrapping the response.
     * Only use if `execProtocol()` doesn't suite your needs.
     *
     * **Warning:** This bypasses PGlite's protocol wrappers that manage error/notice messages,
     * transactions, and notification listeners. Only use if you need to bypass these wrappers and
     * don't intend to use the above features.
     *
     * @param message The postgres wire protocol message to execute
     * @returns The direct message data response produced by Postgres
     */
    execProtocolRaw(message: Uint8Array, { syncToFs }?: ExecProtocolOptions): Promise<Uint8Array>;
    /**
     * Execute a postgres wire protocol message
     * @param message The postgres wire protocol message to execute
     * @returns The result of the query
     */
    execProtocol(message: Uint8Array, { syncToFs, throwOnError, onNotice, }?: ExecProtocolOptions): Promise<Array<[BackendMessage, Uint8Array]>>;
    /**
     * Check if the database is in a transaction
     * @returns True if the database is in a transaction, false otherwise
     */
    isInTransaction(): boolean;
    /**
     * Perform any sync operations implemented by the filesystem, this is
     * run after every query to ensure that the filesystem is synced.
     */
    syncToFs(): Promise<void>;
    /**
     * Listen for a notification
     * @param channel The channel to listen on
     * @param callback The callback to call when a notification is received
     */
    listen(channel: string, callback: (payload: string) => void): Promise<() => Promise<void>>;
    /**
     * Stop listening for a notification
     * @param channel The channel to stop listening on
     * @param callback The callback to remove
     */
    unlisten(channel: string, callback?: (payload: string) => void): Promise<void>;
    /**
     * Listen to notifications
     * @param callback The callback to call when a notification is received
     */
    onNotification(callback: (channel: string, payload: string) => void): () => void;
    /**
     * Stop listening to notifications
     * @param callback The callback to remove
     */
    offNotification(callback: (channel: string, payload: string) => void): void;
    /**
     * Dump the PGDATA dir from the filesystem to a gziped tarball.
     * @param compression The compression options to use - 'gzip', 'auto', 'none'
     * @returns The tarball as a File object where available, and fallback to a Blob
     */
    dumpDataDir(compression?: DumpTarCompressionOptions): Promise<File | Blob>;
    /**
     * Run a function in a mutex that's exclusive to queries
     * @param fn The query to run
     * @returns The result of the query
     */
    _runExclusiveQuery<T>(fn: () => Promise<T>): Promise<T>;
    /**
     * Run a function in a mutex that's exclusive to transactions
     * @param fn The function to run
     * @returns The result of the function
     */
    _runExclusiveTransaction<T>(fn: () => Promise<T>): Promise<T>;
}

export { BasePGlite as B, type Parser as P, PGlite as a, types$1 as t };
