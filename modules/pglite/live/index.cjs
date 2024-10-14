"use strict";var j=Object.defineProperty;var ue=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var le=Object.prototype.hasOwnProperty;var J=e=>{throw TypeError(e)};var pe=(e,t)=>{for(var n in t)j(e,n,{get:t[n],enumerable:!0})},de=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of ce(t))!le.call(e,s)&&s!==n&&j(e,s,{get:()=>t[s],enumerable:!(r=ue(t,s))||r.enumerable});return e};var fe=e=>de(j({},"__esModule",{value:!0}),e);var H=(e,t,n)=>t.has(e)||J("Cannot "+n);var i=(e,t,n)=>(H(e,t,"read from private field"),n?n.call(e):t.get(e)),L=(e,t,n)=>t.has(e)?J("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,n),w=(e,t,n,r)=>(H(e,t,"write to private field"),r?r.call(e,n):t.set(e,n),n),T=(e,t,n)=>(H(e,t,"access private method"),n);var Q=(e,t,n,r)=>({set _(s){w(e,t,s,n)},get _(){return i(e,t,r)}});var rt={};pe(rt,{live:()=>nt});module.exports=fe(rt);function B(e){let t=e.length;for(let n=e.length-1;n>=0;n--){let r=e.charCodeAt(n);r>127&&r<=2047?t++:r>2047&&r<=65535&&(t+=2),r>=56320&&r<=57343&&n--}return t}var m,y,P,q,$,b,V,O,K,x=class{constructor(t=256){this.size=t;L(this,b);L(this,m);L(this,y,5);L(this,P,!1);L(this,q,new TextEncoder);L(this,$,0);w(this,m,T(this,b,V).call(this,t))}addInt32(t){return T(this,b,O).call(this,4),i(this,m).setInt32(i(this,y),t,i(this,P)),w(this,y,i(this,y)+4),this}addInt16(t){return T(this,b,O).call(this,2),i(this,m).setInt16(i(this,y),t,i(this,P)),w(this,y,i(this,y)+2),this}addCString(t){return t&&this.addString(t),T(this,b,O).call(this,1),i(this,m).setUint8(i(this,y),0),Q(this,y)._++,this}addString(t=""){let n=B(t);return T(this,b,O).call(this,n),i(this,q).encodeInto(t,new Uint8Array(i(this,m).buffer,i(this,y))),w(this,y,i(this,y)+n),this}add(t){return T(this,b,O).call(this,t.byteLength),new Uint8Array(i(this,m).buffer).set(new Uint8Array(t),i(this,y)),w(this,y,i(this,y)+t.byteLength),this}flush(t){let n=T(this,b,K).call(this,t);return w(this,y,5),w(this,m,T(this,b,V).call(this,this.size)),new Uint8Array(n)}};m=new WeakMap,y=new WeakMap,P=new WeakMap,q=new WeakMap,$=new WeakMap,b=new WeakSet,V=function(t){return new DataView(new ArrayBuffer(t))},O=function(t){if(i(this,m).byteLength-i(this,y)<t){let r=i(this,m).buffer,s=r.byteLength+(r.byteLength>>1)+t;w(this,m,T(this,b,V).call(this,s)),new Uint8Array(i(this,m).buffer).set(new Uint8Array(r))}},K=function(t){if(t){i(this,m).setUint8(i(this,$),t);let n=i(this,y)-(i(this,$)+1);i(this,m).setInt32(i(this,$)+1,n,i(this,P))}return i(this,m).buffer.slice(t?0:5,i(this,y))};var l=new x,me=e=>{l.addInt16(3).addInt16(0);for(let r of Object.keys(e))l.addCString(r).addCString(e[r]);l.addCString("client_encoding").addCString("UTF8");let t=l.addCString("").flush(),n=t.byteLength+4;return new x().addInt32(n).add(t).flush()},ye=()=>{let e=new DataView(new ArrayBuffer(8));return e.setInt32(0,8,!1),e.setInt32(4,80877103,!1),new Uint8Array(e.buffer)},he=e=>l.addCString(e).flush(112),ge=(e,t)=>(l.addCString(e).addInt32(B(t)).addString(t),l.flush(112)),be=e=>l.addString(e).flush(112),Ee=e=>l.addCString(e).flush(81),_e=[],we=e=>{let t=e.name??"";t.length>63&&(console.error("Warning! Postgres only supports 63 characters for query names."),console.error("You supplied %s (%s)",t,t.length),console.error("This can cause conflicts and silent errors executing queries"));let n=l.addCString(t).addCString(e.text).addInt16(e.types?.length??0);return e.types?.forEach(r=>n.addInt32(r)),l.flush(80)},U=new x;var Ae=(e,t)=>{for(let n=0;n<e.length;n++){let r=t?t(e[n],n):e[n];if(r===null)l.addInt16(0),U.addInt32(-1);else if(r instanceof ArrayBuffer||ArrayBuffer.isView(r)){let s=ArrayBuffer.isView(r)?r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength):r;l.addInt16(1),U.addInt32(s.byteLength),U.add(s)}else l.addInt16(0),U.addInt32(B(r)),U.addString(r)}},Te=(e={})=>{let t=e.portal??"",n=e.statement??"",r=e.binary??!1,s=e.values??_e,c=s.length;return l.addCString(t).addCString(n),l.addInt16(c),Ae(s,e.valueMapper),l.addInt16(c),l.add(U.flush()),l.addInt16(r?1:0),l.flush(66)},Re=new Uint8Array([69,0,0,0,9,0,0,0,0,0]),Se=e=>{if(!e||!e.portal&&!e.rows)return Re;let t=e.portal??"",n=e.rows??0,r=B(t),s=4+r+1+4,c=new DataView(new ArrayBuffer(1+s));return c.setUint8(0,69),c.setInt32(1,s,!1),new TextEncoder().encodeInto(t,new Uint8Array(c.buffer,5)),c.setUint8(r+5,0),c.setUint32(c.byteLength-4,n,!1),new Uint8Array(c.buffer)},Ie=(e,t)=>{let n=new DataView(new ArrayBuffer(16));return n.setInt32(0,16,!1),n.setInt16(4,1234,!1),n.setInt16(6,5678,!1),n.setInt32(8,e,!1),n.setInt32(12,t,!1),new Uint8Array(n.buffer)},z=(e,t)=>{let n=new x;return n.addCString(t),n.flush(e)},De=l.addCString("P").flush(68),Le=l.addCString("S").flush(68),Ce=e=>e.name?z(68,`${e.type}${e.name??""}`):e.type==="P"?De:Le,Ne=e=>{let t=`${e.type}${e.name??""}`;return z(67,t)},Me=e=>l.add(e).flush(100),xe=e=>z(102,e),k=e=>new Uint8Array([e,0,0,0,4]),Be=k(72),Oe=k(83),Pe=k(88),$e=k(99),F={startup:me,password:he,requestSsl:ye,sendSASLInitialResponseMessage:ge,sendSCRAMClientFinalMessage:be,query:Ee,parse:we,bind:Te,execute:Se,describe:Ce,close:Ne,flush:()=>Be,sync:()=>Oe,end:()=>Pe,copyData:Me,copyDone:()=>$e,copyFail:xe,cancel:Ie};var bt=new ArrayBuffer(0);var ve=1,Fe=4,sn=ve+Fe,an=new ArrayBuffer(0);var Ve=globalThis.JSON.parse,qe=globalThis.JSON.stringify,Z=16,ee=17;var te=20,ke=21,Ge=23;var G=25,We=26;var ne=114;var je=700,He=701;var Qe=1042,ze=1043,Xe=1082;var Ye=1114,re=1184;var Je=3802;var Ke={string:{to:G,from:[G,ze,Qe],serialize:e=>{if(typeof e=="string")return e;if(typeof e=="number")return e.toString();throw new Error("Invalid input for string type")},parse:e=>e},number:{to:0,from:[ke,Ge,We,je,He],serialize:e=>e.toString(),parse:e=>+e},bigint:{to:te,from:[te],serialize:e=>e.toString(),parse:e=>{let t=BigInt(e);return t<Number.MIN_SAFE_INTEGER||t>Number.MAX_SAFE_INTEGER?t:Number(t)}},json:{to:ne,from:[ne,Je],serialize:e=>qe(e),parse:e=>Ve(e)},boolean:{to:Z,from:[Z],serialize:e=>{if(typeof e!="boolean")throw new Error("Invalid input for boolean type");return e?"t":"f"},parse:e=>e==="t"},date:{to:re,from:[Xe,Ye,re],serialize:e=>{if(typeof e=="string")return e;if(typeof e=="number")return new Date(e).toISOString();if(e instanceof Date)return e.toISOString();throw new Error("Invalid input for date type")},parse:e=>new Date(e)},bytea:{to:ee,from:[ee],serialize:e=>{if(!(e instanceof Uint8Array))throw new Error("Invalid input for bytea type");return"\\x"+Array.from(e).map(t=>t.toString(16).padStart(2,"0")).join("")},parse:e=>{let t=e.slice(2);return Uint8Array.from({length:t.length/2},(n,r)=>parseInt(t.substring(r*2,(r+1)*2),16))}}},se=Ze(Ke),yn=se.parsers,hn=se.serializers;function Ze(e){return Object.keys(e).reduce(({parsers:t,serializers:n},r)=>{let{to:s,from:c,serialize:o,parse:p}=e[r];return n[s]=o,n[r]=o,t[r]=p,Array.isArray(c)?c.forEach(a=>{t[a]=p,n[a]=o}):(t[c]=p,n[c]=o),{parsers:t,serializers:n}},{parsers:{},serializers:{}})}function ae(e){let t=e.find(n=>n.name==="parameterDescription");return t?t.dataTypeIDs:[]}var In=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string";var X=()=>{if(globalThis.crypto?.randomUUID)return globalThis.crypto.randomUUID();let e=new Uint8Array(16);if(globalThis.crypto?.getRandomValues)globalThis.crypto.getRandomValues(e);else for(let n=0;n<e.length;n++)e[n]=Math.floor(Math.random()*256);e[6]=e[6]&15|64,e[8]=e[8]&63|128;let t=[];return e.forEach(n=>{t.push(n.toString(16).padStart(2,"0"))}),t.slice(0,4).join("")+"-"+t.slice(4,6).join("")+"-"+t.slice(6,8).join("")+"-"+t.slice(8,10).join("")+"-"+t.slice(10).join("")};async function Y(e,t,n,r){if(!n||n.length===0)return t;r=r??e;let s;try{await e.execProtocol(F.parse({text:t}),{syncToFs:!1}),s=ae((await e.execProtocol(F.describe({type:"S"}),{syncToFs:!1})).map(([p])=>p))}finally{await e.execProtocol(F.sync(),{syncToFs:!1})}let c=t.replace(/\$([0-9]+)/g,(p,a)=>"%"+a+"L");return(await r.query(`SELECT format($1, ${n.map((p,a)=>`$${a+2}`).join(", ")}) as query`,[c,...n],{paramTypes:[G,...s]})).rows[0].query}var et=5,tt=async(e,t)=>{let n=new Set,r={async query(s,c,o){let p=X().replace(/-/g,""),a,E,_=async()=>{await e.transaction(async f=>{let S=await Y(e,s,c,f);await f.query(`CREATE OR REPLACE TEMP VIEW live_query_${p}_view AS ${S}`),E=await ie(f,`live_query_${p}_view`),await oe(f,E,n),await f.exec(`
            PREPARE live_query_${p}_get AS
            SELECT * FROM live_query_${p}_view;
          `),a=await f.query(`EXECUTE live_query_${p}_get;`)})};await _();let A=async(f=0)=>{try{a=await e.query(`EXECUTE live_query_${p}_get;`)}catch(S){if(S.message===`prepared statement "live_query_${p}_get" does not exist`){if(f>et)throw S;await _(),A(f+1)}else throw S}o(a)},C=await Promise.all(E.map(f=>e.listen(`table_change__${f.schema_name}__${f.table_name}`,async()=>{A()}))),N=async()=>{await Promise.all(C.map(f=>f())),await e.exec(`
            DROP VIEW IF EXISTS live_query_${p}_view;
            DEALLOCATE live_query_${p}_get;
          `)};return o(a),{initialResults:a,unsubscribe:N,refresh:A}},async changes(s,c,o,p){let a=X().replace(/-/g,""),E,_=1,A,C=async()=>{await e.transaction(async d=>{let I=await Y(e,s,c,d);await d.query(`CREATE OR REPLACE TEMP VIEW live_query_${a}_view AS ${I}`),E=await ie(d,`live_query_${a}_view`),await oe(d,E,n);let g=[...(await d.query(`
                SELECT column_name, data_type, udt_name
                FROM information_schema.columns 
                WHERE table_name = 'live_query_${a}_view'
              `)).rows,{column_name:"__after__",data_type:"integer"}];await d.exec(`
            CREATE TEMP TABLE live_query_${a}_state1 (LIKE live_query_${a}_view INCLUDING ALL);
            CREATE TEMP TABLE live_query_${a}_state2 (LIKE live_query_${a}_view INCLUDING ALL);
          `);for(let D of[1,2]){let h=D===1?2:1;await d.exec(`
              PREPARE live_query_${a}_diff${D} AS
              WITH
                prev AS (SELECT LAG("${o}") OVER () as __after__, * FROM live_query_${a}_state${h}),
                curr AS (SELECT LAG("${o}") OVER () as __after__, * FROM live_query_${a}_state${D}),
                data_diff AS (
                  -- INSERT operations: Include all columns
                  SELECT 
                    'INSERT' AS __op__,
                    ${g.map(({column_name:u})=>`curr."${u}" AS "${u}"`).join(`,
`)},
                    ARRAY[]::text[] AS __changed_columns__
                  FROM curr
                  LEFT JOIN prev ON curr.${o} = prev.${o}
                  WHERE prev.${o} IS NULL
                UNION ALL
                  -- DELETE operations: Include only the primary key
                  SELECT 
                    'DELETE' AS __op__,
                    ${g.map(({column_name:u,data_type:M,udt_name:W})=>u===o?`prev."${u}" AS "${u}"`:`NULL${M==="USER-DEFINED"?`::${W}`:""} AS "${u}"`).join(`,
`)},
                      ARRAY[]::text[] AS __changed_columns__
                  FROM prev
                  LEFT JOIN curr ON prev.${o} = curr.${o}
                  WHERE curr.${o} IS NULL
                UNION ALL
                  -- UPDATE operations: Include only changed columns
                  SELECT 
                    'UPDATE' AS __op__,
                    ${g.map(({column_name:u,data_type:M,udt_name:W})=>u===o?`curr."${u}" AS "${u}"`:`CASE 
                              WHEN curr."${u}" IS DISTINCT FROM prev."${u}" 
                              THEN curr."${u}"
                              ELSE NULL${M==="USER-DEFINED"?`::${W}`:""}
                              END AS "${u}"`).join(`,
`)},
                      ARRAY(SELECT unnest FROM unnest(ARRAY[${g.filter(({column_name:u})=>u!==o).map(({column_name:u})=>`CASE
                              WHEN curr."${u}" IS DISTINCT FROM prev."${u}" 
                              THEN '${u}' 
                              ELSE NULL 
                              END`).join(", ")}]) WHERE unnest IS NOT NULL) AS __changed_columns__
                  FROM curr
                  INNER JOIN prev ON curr.${o} = prev.${o}
                  WHERE NOT (curr IS NOT DISTINCT FROM prev)
                )
              SELECT * FROM data_diff;
            `)}})};await C();let N=async()=>{let d=!1;for(let I=0;I<5;I++)try{await e.transaction(async g=>{await g.exec(`
                DELETE FROM live_query_${a}_state${_};
                INSERT INTO live_query_${a}_state${_} 
                  SELECT * FROM live_query_${a}_view;
              `),A=await g.query(`EXECUTE live_query_${a}_diff${_};`)});break}catch(g){if(g.message===`relation "live_query_${a}_state${_}" does not exist`){d=!0,await C();continue}else throw g}_=_===1?2:1,p([...d?[{__op__:"RESET"}]:[],...A.rows])},f=await Promise.all(E.map(d=>e.listen(`table_change__${d.schema_name}__${d.table_name}`,async()=>N()))),S=async()=>{await Promise.all(f.map(d=>d())),await e.exec(`
          DROP VIEW IF EXISTS live_query_${a}_view;
          DROP TABLE IF EXISTS live_query_${a}_state1;
          DROP TABLE IF EXISTS live_query_${a}_state2;
          DEALLOCATE live_query_${a}_diff1;
          DEALLOCATE live_query_${a}_diff2;
        `)};return await N(),{fields:A.fields.filter(d=>!["__after__","__op__","__changed_columns__"].includes(d.name)),initialChanges:A.rows,unsubscribe:S,refresh:N}},async incrementalQuery(s,c,o,p){let a=new Map,E=new Map,_=[],A=!0,{fields:C,unsubscribe:N,refresh:f}=await r.changes(s,c,o,S=>{for(let I of S){let{__op__:g,__changed_columns__:D,...h}=I;switch(g){case"RESET":a.clear(),E.clear();break;case"INSERT":a.set(h[o],h),E.set(h.__after__,h[o]);break;case"DELETE":{let u=a.get(h[o]);a.delete(h[o]),E.delete(u.__after__);break}case"UPDATE":{let u={...a.get(h[o])??{}};for(let M of D)u[M]=h[M],M==="__after__"&&E.set(h.__after__,h[o]);a.set(h[o],u);break}}}let v=[],d=null;for(let I=0;I<a.size;I++){let g=E.get(d),D=a.get(g);if(!D)break;let h={...D};delete h.__after__,v.push(h),d=g}_=v,A||p({rows:v,fields:C})});return A=!1,p({rows:_,fields:C}),{initialResults:{rows:_,fields:C},unsubscribe:N,refresh:f}}};return{namespaceObj:r}},nt={name:"Live Queries",setup:tt};async function ie(e,t){return(await e.query(`
        SELECT DISTINCT
          cl.relname AS table_name,
          n.nspname AS schema_name
        FROM pg_rewrite r
        JOIN pg_depend d ON r.oid = d.objid
        JOIN pg_class cl ON d.refobjid = cl.oid
        JOIN pg_namespace n ON cl.relnamespace = n.oid
        WHERE
        r.ev_class = (
            SELECT oid FROM pg_class WHERE relname = $1 AND relkind = 'v'
        )
        AND d.deptype = 'n';
      `,[t])).rows.filter(n=>n.table_name!==t)}async function oe(e,t,n){let r=t.filter(s=>!n.has(`${s.schema_name}_${s.table_name}`)).map(s=>`
      CREATE OR REPLACE FUNCTION "_notify_${s.schema_name}_${s.table_name}"() RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('table_change__${s.schema_name}__${s.table_name}', '');
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;
      CREATE OR REPLACE TRIGGER "_notify_trigger_${s.schema_name}_${s.table_name}"
      AFTER INSERT OR UPDATE OR DELETE ON "${s.schema_name}"."${s.table_name}"
      FOR EACH STATEMENT EXECUTE FUNCTION "_notify_${s.schema_name}_${s.table_name}"();
      `).join(`
`);r.trim()!==""&&await e.exec(r),t.map(s=>n.add(`${s.schema_name}_${s.table_name}`))}0&&(module.exports={live});
//# sourceMappingURL=index.cjs.map