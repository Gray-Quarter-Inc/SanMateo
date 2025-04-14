select top 1 b1_owner_full_name
from b3owner 
where  b1_per_id1 = '$$capID1$$'
  and b1_per_id2 = '$$capID2$$'
  and b1_per_id3 = '$$capID3$$'
  and serv_prov_code = '$$servProvCode$$'
  and rec_status = 'A'
order by b1_primary_owner desc


