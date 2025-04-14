select
   b1_alt_id
from
   dbo.b1permit b
where b.b1_per_id1 = '$$capID1$$'
  and b.b1_per_id2 = '$$capID2$$'
  and b.b1_per_id3 = '$$capID3$$'
  and b.serv_prov_code = '$$servProvCode$$'