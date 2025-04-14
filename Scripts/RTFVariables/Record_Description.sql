select top 1 b1_work_desc
from dbo.bworkdes a inner join dbo.b1permit p on (a.serv_prov_code = p.serv_prov_code and a.b1_per_id1 = p.b1_per_id1 and a.b1_per_id2 = p.b1_per_id2 and a.b1_per_id3 = p.b1_per_id3)
where  a.b1_per_id1 = '$$capID1$$'
  and a.b1_per_id2 = '$$capID2$$'
  and a.b1_per_id3 = '$$capID3$$'
  and a.serv_prov_code = '$$servProvCode$$'
  and a.rec_status = 'A'
order by rec_date desc


