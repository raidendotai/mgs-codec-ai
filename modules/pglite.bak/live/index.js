import{u as N,v as g}from"../chunk-AOCDFDRO.js";import{i as I}from"../chunk-Y3AVQXKT.js";I();var h=5,C=async(E,A)=>{let f=new Set,v={async query(s,S,t){let c=N().replace(/-/g,""),e,o,l=async()=>{await E.transaction(async n=>{let T=await g(E,s,S,n);await n.query(`CREATE OR REPLACE TEMP VIEW live_query_${c}_view AS ${T}`),o=await w(n,`live_query_${c}_view`),await O(n,o,f),await n.exec(`
            PREPARE live_query_${c}_get AS
            SELECT * FROM live_query_${c}_view;
          `),e=await n.query(`EXECUTE live_query_${c}_get;`)})};await l();let u=async(n=0)=>{try{e=await E.query(`EXECUTE live_query_${c}_get;`)}catch(T){if(T.message===`prepared statement "live_query_${c}_get" does not exist`){if(n>h)throw T;await l(),u(n+1)}else throw T}t(e)},m=await Promise.all(o.map(n=>E.listen(`table_change__${n.schema_name}__${n.table_name}`,async()=>{u()}))),y=async()=>{await Promise.all(m.map(n=>n())),await E.exec(`
            DROP VIEW IF EXISTS live_query_${c}_view;
            DEALLOCATE live_query_${c}_get;
          `)};return t(e),{initialResults:e,unsubscribe:y,refresh:u}},async changes(s,S,t,c){let e=N().replace(/-/g,""),o,l=1,u,m=async()=>{await E.transaction(async r=>{let R=await g(E,s,S,r);await r.query(`CREATE OR REPLACE TEMP VIEW live_query_${e}_view AS ${R}`),o=await w(r,`live_query_${e}_view`),await O(r,o,f);let _=[...(await r.query(`
                SELECT column_name, data_type, udt_name
                FROM information_schema.columns 
                WHERE table_name = 'live_query_${e}_view'
              `)).rows,{column_name:"__after__",data_type:"integer"}];await r.exec(`
            CREATE TEMP TABLE live_query_${e}_state1 (LIKE live_query_${e}_view INCLUDING ALL);
            CREATE TEMP TABLE live_query_${e}_state2 (LIKE live_query_${e}_view INCLUDING ALL);
          `);for(let $ of[1,2]){let i=$===1?2:1;await r.exec(`
              PREPARE live_query_${e}_diff${$} AS
              WITH
                prev AS (SELECT LAG("${t}") OVER () as __after__, * FROM live_query_${e}_state${i}),
                curr AS (SELECT LAG("${t}") OVER () as __after__, * FROM live_query_${e}_state${$}),
                data_diff AS (
                  -- INSERT operations: Include all columns
                  SELECT 
                    'INSERT' AS __op__,
                    ${_.map(({column_name:a})=>`curr."${a}" AS "${a}"`).join(`,
`)},
                    ARRAY[]::text[] AS __changed_columns__
                  FROM curr
                  LEFT JOIN prev ON curr.${t} = prev.${t}
                  WHERE prev.${t} IS NULL
                UNION ALL
                  -- DELETE operations: Include only the primary key
                  SELECT 
                    'DELETE' AS __op__,
                    ${_.map(({column_name:a,data_type:L,udt_name:d})=>a===t?`prev."${a}" AS "${a}"`:`NULL${L==="USER-DEFINED"?`::${d}`:""} AS "${a}"`).join(`,
`)},
                      ARRAY[]::text[] AS __changed_columns__
                  FROM prev
                  LEFT JOIN curr ON prev.${t} = curr.${t}
                  WHERE curr.${t} IS NULL
                UNION ALL
                  -- UPDATE operations: Include only changed columns
                  SELECT 
                    'UPDATE' AS __op__,
                    ${_.map(({column_name:a,data_type:L,udt_name:d})=>a===t?`curr."${a}" AS "${a}"`:`CASE 
                              WHEN curr."${a}" IS DISTINCT FROM prev."${a}" 
                              THEN curr."${a}"
                              ELSE NULL${L==="USER-DEFINED"?`::${d}`:""}
                              END AS "${a}"`).join(`,
`)},
                      ARRAY(SELECT unnest FROM unnest(ARRAY[${_.filter(({column_name:a})=>a!==t).map(({column_name:a})=>`CASE
                              WHEN curr."${a}" IS DISTINCT FROM prev."${a}" 
                              THEN '${a}' 
                              ELSE NULL 
                              END`).join(", ")}]) WHERE unnest IS NOT NULL) AS __changed_columns__
                  FROM curr
                  INNER JOIN prev ON curr.${t} = prev.${t}
                  WHERE NOT (curr IS NOT DISTINCT FROM prev)
                )
              SELECT * FROM data_diff;
            `)}})};await m();let y=async()=>{let r=!1;for(let R=0;R<5;R++)try{await E.transaction(async _=>{await _.exec(`
                DELETE FROM live_query_${e}_state${l};
                INSERT INTO live_query_${e}_state${l} 
                  SELECT * FROM live_query_${e}_view;
              `),u=await _.query(`EXECUTE live_query_${e}_diff${l};`)});break}catch(_){if(_.message===`relation "live_query_${e}_state${l}" does not exist`){r=!0,await m();continue}else throw _}l=l===1?2:1,c([...r?[{__op__:"RESET"}]:[],...u.rows])},n=await Promise.all(o.map(r=>E.listen(`table_change__${r.schema_name}__${r.table_name}`,async()=>y()))),T=async()=>{await Promise.all(n.map(r=>r())),await E.exec(`
          DROP VIEW IF EXISTS live_query_${e}_view;
          DROP TABLE IF EXISTS live_query_${e}_state1;
          DROP TABLE IF EXISTS live_query_${e}_state2;
          DEALLOCATE live_query_${e}_diff1;
          DEALLOCATE live_query_${e}_diff2;
        `)};return await y(),{fields:u.fields.filter(r=>!["__after__","__op__","__changed_columns__"].includes(r.name)),initialChanges:u.rows,unsubscribe:T,refresh:y}},async incrementalQuery(s,S,t,c){let e=new Map,o=new Map,l=[],u=!0,{fields:m,unsubscribe:y,refresh:n}=await v.changes(s,S,t,T=>{for(let R of T){let{__op__:_,__changed_columns__:$,...i}=R;switch(_){case"RESET":e.clear(),o.clear();break;case"INSERT":e.set(i[t],i),o.set(i.__after__,i[t]);break;case"DELETE":{let a=e.get(i[t]);e.delete(i[t]),o.delete(a.__after__);break}case"UPDATE":{let a={...e.get(i[t])??{}};for(let L of $)a[L]=i[L],L==="__after__"&&o.set(i.__after__,i[t]);e.set(i[t],a);break}}}let p=[],r=null;for(let R=0;R<e.size;R++){let _=o.get(r),$=e.get(_);if(!$)break;let i={...$};delete i.__after__,p.push(i),r=_}l=p,u||c({rows:p,fields:m})});return u=!1,c({rows:l,fields:m}),{initialResults:{rows:l,fields:m},unsubscribe:y,refresh:n}}};return{namespaceObj:v}},b={name:"Live Queries",setup:C};async function w(E,A){return(await E.query(`
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
      `,[A])).rows.filter(f=>f.table_name!==A)}async function O(E,A,f){let v=A.filter(s=>!f.has(`${s.schema_name}_${s.table_name}`)).map(s=>`
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
`);v.trim()!==""&&await E.exec(v),A.map(s=>f.add(`${s.schema_name}_${s.table_name}`))}export{b as live};
//# sourceMappingURL=index.js.map