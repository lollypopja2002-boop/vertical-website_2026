/* 공용 저장소 연결. 연결 정보가 없으면 기존 브라우저 저장을 유지합니다. */
window.createGuestbookCloud = async () => {
 const config=window.guestbookCloudConfig;
 if(!config?.url || !config?.publishableKey)return null;
 const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
 const client=createClient(config.url,config.publishableKey);
 let {data:{session},error}=await client.auth.getSession();
 if(error)throw error;
 if(!session){const result=await client.auth.signInAnonymously();if(result.error)throw result.error;session=result.data.session;}
 const ownerId=session.user.id;
 return {
  ownerId,
  async read(){
   const rows=[];
   for(let offset=0;;offset+=1000){
    const {data,error}=await client.from('guestbook_stamps').select('id,owner_id,payload').order('created_at').order('id').range(offset,offset+999);
    if(error)throw error;
    rows.push(...data.map(row=>({...row.payload,id:row.id,ownerId:row.owner_id,cloudSaved:true})));
    if(data.length<1000)return rows;
   }
  },
  async upload(stamps){
   const rows=stamps.filter(s=>!s.cloudSaved && (!s.ownerId || s.ownerId===ownerId)).map(({id,ownerId:_,cloudSaved:__,...payload})=>({id,owner_id:ownerId,payload}));
   for(let offset=0;offset<rows.length;offset+=100){
    const {error}=await client.from('guestbook_stamps').upsert(rows.slice(offset,offset+100),{onConflict:'id',ignoreDuplicates:true});
    if(error)throw error;
   }
  },
  async remove(id){
   const {error}=await client.from('guestbook_stamps').delete().eq('id',id).eq('owner_id',ownerId);
   if(error)throw error;
  }
 };
};
