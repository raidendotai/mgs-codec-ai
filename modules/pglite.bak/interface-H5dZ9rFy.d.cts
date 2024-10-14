import { b as Filesystem, D as DumpTarCompressionOptions } from './types-BV23hhqY.cjs';

declare const Modes: {
    readonly text: 0;
    readonly binary: 1;
};
type Mode = (typeof Modes)[keyof typeof Modes];
type BufferParameter = ArrayBuffer | ArrayBufferView;

type MessageName = 'parseComplete' | 'bindComplete' | 'closeComplete' | 'noData' | 'portalSuspended' | 'replicationStart' | 'emptyQuery' | 'copyDone' | 'copyData' | 'rowDescription' | 'parameterDescription' | 'parameterStatus' | 'backendKeyData' | 'notification' | 'readyForQuery' | 'commandComplete' | 'dataRow' | 'copyInResponse' | 'copyOutResponse' | 'authenticationOk' | 'authenticationMD5Password' | 'authenticationCleartextPassword' | 'authenticationSASL' | 'authenticationSASLContinue' | 'authenticationSASLFinal' | 'error' | 'notice';
type BackendMessage = {
    name: MessageName;
    length: number;
};
declare const parseComplete: BackendMessage;
declare const bindComplete: BackendMessage;
declare const closeComplete: BackendMessage;
declare const noData: BackendMessage;
declare const portalSuspended: BackendMessage;
declare const replicationStart: BackendMessage;
declare const emptyQuery: BackendMessage;
declare const copyDone: BackendMessage;
declare class AuthenticationOk implements BackendMessage {
    readonly length: number;
    readonly name = "authenticationOk";
    constructor(length: number);
}
declare class AuthenticationCleartextPassword implements BackendMessage {
    readonly length: number;
    readonly name = "authenticationCleartextPassword";
    constructor(length: number);
}
declare class AuthenticationMD5Password implements BackendMessage {
    readonly length: number;
    readonly salt: Uint8Array;
    readonly name = "authenticationMD5Password";
    constructor(length: number, salt: Uint8Array);
}
declare class AuthenticationSASL implements BackendMessage {
    readonly length: number;
    readonly mechanisms: string[];
    readonly name = "authenticationSASL";
    constructor(length: number, mechanisms: string[]);
}
declare class AuthenticationSASLContinue implements BackendMessage {
    readonly length: number;
    readonly data: string;
    readonly name = "authenticationSASLContinue";
    constructor(length: number, data: string);
}
declare class AuthenticationSASLFinal implements BackendMessage {
    readonly length: number;
    readonly data: string;
    readonly name = "authenticationSASLFinal";
    constructor(length: number, data: string);
}
type AuthenticationMessage = AuthenticationOk | AuthenticationCleartextPassword | AuthenticationMD5Password | AuthenticationSASL | AuthenticationSASLContinue | AuthenticationSASLFinal;
interface NoticeOrError {
    message: string | undefined;
    severity: string | undefined;
    code: string | undefined;
    detail: string | undefined;
    hint: string | undefined;
    position: string | undefined;
    internalPosition: string | undefined;
    internalQuery: string | undefined;
    where: string | undefined;
    schema: string | undefined;
    table: string | undefined;
    column: string | undefined;
    dataType: string | undefined;
    constraint: string | undefined;
    file: string | undefined;
    line: string | undefined;
    routine: string | undefined;
}
declare class DatabaseError extends Error implements NoticeOrError {
    readonly length: number;
    readonly name: MessageName;
    severity: string | undefined;
    code: string | undefined;
    detail: string | undefined;
    hint: string | undefined;
    position: string | undefined;
    internalPosition: string | undefined;
    internalQuery: string | undefined;
    where: string | undefined;
    schema: string | undefined;
    table: string | undefined;
    column: string | undefined;
    dataType: string | undefined;
    constraint: string | undefined;
    file: string | undefined;
    line: string | undefined;
    routine: string | undefined;
    constructor(message: string, length: number, name: MessageName);
}
declare class CopyDataMessage implements BackendMessage {
    readonly length: number;
    readonly chunk: Uint8Array;
    readonly name = "copyData";
    constructor(length: number, chunk: Uint8Array);
}
declare class CopyResponse implements BackendMessage {
    readonly length: number;
    readonly name: MessageName;
    readonly binary: boolean;
    readonly columnTypes: number[];
    constructor(length: number, name: MessageName, binary: boolean, columnCount: number);
}
declare class Field {
    readonly name: string;
    readonly tableID: number;
    readonly columnID: number;
    readonly dataTypeID: number;
    readonly dataTypeSize: number;
    readonly dataTypeModifier: number;
    readonly format: Mode;
    constructor(name: string, tableID: number, columnID: number, dataTypeID: number, dataTypeSize: number, dataTypeModifier: number, format: Mode);
}
declare class RowDescriptionMessage implements BackendMessage {
    readonly length: number;
    readonly fieldCount: number;
    readonly name: MessageName;
    readonly fields: Field[];
    constructor(length: number, fieldCount: number);
}
declare class ParameterDescriptionMessage implements BackendMessage {
    readonly length: number;
    readonly parameterCount: number;
    readonly name: MessageName;
    readonly dataTypeIDs: number[];
    constructor(length: number, parameterCount: number);
}
declare class ParameterStatusMessage implements BackendMessage {
    readonly length: number;
    readonly parameterName: string;
    readonly parameterValue: string;
    readonly name: MessageName;
    constructor(length: number, parameterName: string, parameterValue: string);
}
declare class BackendKeyDataMessage implements BackendMessage {
    readonly length: number;
    readonly processID: number;
    readonly secretKey: number;
    readonly name: MessageName;
    constructor(length: number, processID: number, secretKey: number);
}
declare class NotificationResponseMessage implements BackendMessage {
    readonly length: number;
    readonly processId: number;
    readonly channel: string;
    readonly payload: string;
    readonly name: MessageName;
    constructor(length: number, processId: number, channel: string, payload: string);
}
declare class ReadyForQueryMessage implements BackendMessage {
    readonly length: number;
    readonly status: string;
    readonly name: MessageName;
    constructor(length: number, status: string);
}
declare class CommandCompleteMessage implements BackendMessage {
    readonly length: number;
    readonly text: string;
    readonly name: MessageName;
    constructor(length: number, text: string);
}
declare class DataRowMessage implements BackendMessage {
    length: number;
    fields: (string | null)[];
    readonly fieldCount: number;
    readonly name: MessageName;
    constructor(length: number, fields: (string | null)[]);
}
declare class NoticeMessage implements BackendMessage, NoticeOrError {
    readonly length: number;
    readonly message: string | undefined;
    constructor(length: number, message: string | undefined);
    readonly name = "notice";
    severity: string | undefined;
    code: string | undefined;
    detail: string | undefined;
    hint: string | undefined;
    position: string | undefined;
    internalPosition: string | undefined;
    internalQuery: string | undefined;
    where: string | undefined;
    schema: string | undefined;
    table: string | undefined;
    column: string | undefined;
    dataType: string | undefined;
    constraint: string | undefined;
    file: string | undefined;
    line: string | undefined;
    routine: string | undefined;
}

type messages_AuthenticationCleartextPassword = AuthenticationCleartextPassword;
declare const messages_AuthenticationCleartextPassword: typeof AuthenticationCleartextPassword;
type messages_AuthenticationMD5Password = AuthenticationMD5Password;
declare const messages_AuthenticationMD5Password: typeof AuthenticationMD5Password;
type messages_AuthenticationMessage = AuthenticationMessage;
type messages_AuthenticationOk = AuthenticationOk;
declare const messages_AuthenticationOk: typeof AuthenticationOk;
type messages_AuthenticationSASL = AuthenticationSASL;
declare const messages_AuthenticationSASL: typeof AuthenticationSASL;
type messages_AuthenticationSASLContinue = AuthenticationSASLContinue;
declare const messages_AuthenticationSASLContinue: typeof AuthenticationSASLContinue;
type messages_AuthenticationSASLFinal = AuthenticationSASLFinal;
declare const messages_AuthenticationSASLFinal: typeof AuthenticationSASLFinal;
type messages_BackendKeyDataMessage = BackendKeyDataMessage;
declare const messages_BackendKeyDataMessage: typeof BackendKeyDataMessage;
type messages_BackendMessage = BackendMessage;
type messages_CommandCompleteMessage = CommandCompleteMessage;
declare const messages_CommandCompleteMessage: typeof CommandCompleteMessage;
type messages_CopyDataMessage = CopyDataMessage;
declare const messages_CopyDataMessage: typeof CopyDataMessage;
type messages_CopyResponse = CopyResponse;
declare const messages_CopyResponse: typeof CopyResponse;
type messages_DataRowMessage = DataRowMessage;
declare const messages_DataRowMessage: typeof DataRowMessage;
type messages_DatabaseError = DatabaseError;
declare const messages_DatabaseError: typeof DatabaseError;
type messages_Field = Field;
declare const messages_Field: typeof Field;
type messages_MessageName = MessageName;
type messages_NoticeMessage = NoticeMessage;
declare const messages_NoticeMessage: typeof NoticeMessage;
type messages_NotificationResponseMessage = NotificationResponseMessage;
declare const messages_NotificationResponseMessage: typeof NotificationResponseMessage;
type messages_ParameterDescriptionMessage = ParameterDescriptionMessage;
declare const messages_ParameterDescriptionMessage: typeof ParameterDescriptionMessage;
type messages_ParameterStatusMessage = ParameterStatusMessage;
declare const messages_ParameterStatusMessage: typeof ParameterStatusMessage;
type messages_ReadyForQueryMessage = ReadyForQueryMessage;
declare const messages_ReadyForQueryMessage: typeof ReadyForQueryMessage;
type messages_RowDescriptionMessage = RowDescriptionMessage;
declare const messages_RowDescriptionMessage: typeof RowDescriptionMessage;
declare const messages_bindComplete: typeof bindComplete;
declare const messages_closeComplete: typeof closeComplete;
declare const messages_copyDone: typeof copyDone;
declare const messages_emptyQuery: typeof emptyQuery;
declare const messages_noData: typeof noData;
declare const messages_parseComplete: typeof parseComplete;
declare const messages_portalSuspended: typeof portalSuspended;
declare const messages_replicationStart: typeof replicationStart;
declare namespace messages {
  export { messages_AuthenticationCleartextPassword as AuthenticationCleartextPassword, messages_AuthenticationMD5Password as AuthenticationMD5Password, type messages_AuthenticationMessage as AuthenticationMessage, messages_AuthenticationOk as AuthenticationOk, messages_AuthenticationSASL as AuthenticationSASL, messages_AuthenticationSASLContinue as AuthenticationSASLContinue, messages_AuthenticationSASLFinal as AuthenticationSASLFinal, messages_BackendKeyDataMessage as BackendKeyDataMessage, type messages_BackendMessage as BackendMessage, messages_CommandCompleteMessage as CommandCompleteMessage, messages_CopyDataMessage as CopyDataMessage, messages_CopyResponse as CopyResponse, messages_DataRowMessage as DataRowMessage, messages_DatabaseError as DatabaseError, messages_Field as Field, type messages_MessageName as MessageName, messages_NoticeMessage as NoticeMessage, messages_NotificationResponseMessage as NotificationResponseMessage, messages_ParameterDescriptionMessage as ParameterDescriptionMessage, messages_ParameterStatusMessage as ParameterStatusMessage, messages_ReadyForQueryMessage as ReadyForQueryMessage, messages_RowDescriptionMessage as RowDescriptionMessage, messages_bindComplete as bindComplete, messages_closeComplete as closeComplete, messages_copyDone as copyDone, messages_emptyQuery as emptyQuery, messages_noData as noData, messages_parseComplete as parseComplete, messages_portalSuspended as portalSuspended, messages_replicationStart as replicationStart };
}

type FilesystemType = 'nodefs' | 'idbfs' | 'memoryfs';
type DebugLevel = 0 | 1 | 2 | 3 | 4 | 5;
type RowMode = 'array' | 'object';
interface ParserOptions {
    [pgType: number]: (value: string) => any;
}
interface QueryOptions {
    rowMode?: RowMode;
    parsers?: ParserOptions;
    blob?: Blob | File;
    onNotice?: (notice: NoticeMessage) => void;
    paramTypes?: number[];
}
interface ExecProtocolOptions {
    syncToFs?: boolean;
    throwOnError?: boolean;
    onNotice?: (notice: NoticeMessage) => void;
}
interface ExtensionSetupResult {
    emscriptenOpts?: any;
    namespaceObj?: any;
    bundlePath?: URL;
    init?: () => Promise<void>;
    close?: () => Promise<void>;
}
type ExtensionSetup = (pg: PGliteInterface, emscriptenOpts: any, clientOnly?: boolean) => Promise<ExtensionSetupResult>;
interface Extension {
    name: string;
    setup: ExtensionSetup;
}
type Extensions = {
    [namespace: string]: Extension | URL;
};
interface DumpDataDirResult {
    tarball: Uint8Array;
    extension: '.tar' | '.tgz';
    filename: string;
}
interface PGliteOptions {
    dataDir?: string;
    username?: string;
    database?: string;
    fs?: Filesystem;
    debug?: DebugLevel;
    relaxedDurability?: boolean;
    extensions?: Extensions;
    loadDataDir?: Blob | File;
    initialMemory?: number;
    wasmModule?: WebAssembly.Module;
    fsBundle?: Blob | File;
}
type PGliteInterface = {
    readonly waitReady: Promise<void>;
    readonly debug: DebugLevel;
    readonly ready: boolean;
    readonly closed: boolean;
    close(): Promise<void>;
    query<T>(query: string, params?: any[], options?: QueryOptions): Promise<Results<T>>;
    sql<T>(sqlStrings: TemplateStringsArray, ...params: any[]): Promise<Results<T>>;
    exec(query: string, options?: QueryOptions): Promise<Array<Results>>;
    transaction<T>(callback: (tx: Transaction) => Promise<T>): Promise<T | undefined>;
    execProtocolRaw(message: Uint8Array, options?: ExecProtocolOptions): Promise<Uint8Array>;
    execProtocol(message: Uint8Array, options?: ExecProtocolOptions): Promise<Array<[BackendMessage, Uint8Array]>>;
    listen(channel: string, callback: (payload: string) => void): Promise<() => Promise<void>>;
    unlisten(channel: string, callback?: (payload: string) => void): Promise<void>;
    onNotification(callback: (channel: string, payload: string) => void): () => void;
    offNotification(callback: (channel: string, payload: string) => void): void;
    dumpDataDir(compression?: DumpTarCompressionOptions): Promise<File | Blob>;
};
type PGliteInterfaceExtensions<E> = E extends Extensions ? {
    [K in keyof E]: E[K] extends Extension ? Awaited<ReturnType<E[K]['setup']>>['namespaceObj'] extends infer N ? N extends undefined | null | void ? never : N : never : never;
} : Record<string, never>;
type Row<T = {
    [key: string]: any;
}> = T;
type Results<T = {
    [key: string]: any;
}> = {
    rows: Row<T>[];
    affectedRows?: number;
    fields: {
        name: string;
        dataTypeID: number;
    }[];
    blob?: Blob;
};
interface Transaction {
    query<T>(query: string, params?: any[], options?: QueryOptions): Promise<Results<T>>;
    sql<T>(sqlStrings: TemplateStringsArray, ...params: any[]): Promise<Results<T>>;
    exec(query: string, options?: QueryOptions): Promise<Array<Results>>;
    rollback(): Promise<void>;
    get closed(): boolean;
}

export { type BackendMessage as B, type DebugLevel as D, type ExecProtocolOptions as E, type FilesystemType as F, type Mode as M, type PGliteInterface as P, type QueryOptions as Q, type Results as R, type Transaction as T, type BufferParameter as a, type RowMode as b, type ParserOptions as c, type ExtensionSetupResult as d, type ExtensionSetup as e, type Extension as f, type Extensions as g, type DumpDataDirResult as h, type PGliteOptions as i, type PGliteInterfaceExtensions as j, type Row as k, messages as m };
