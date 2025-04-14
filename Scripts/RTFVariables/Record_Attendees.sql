select top 1 b1_checklist_comment 
from bchckbox 
where  b1_per_id1 = '$$capID1$$'
  and b1_per_id2 = '$$capID2$$'
  and b1_per_id3 = '$$capID3$$'
  and serv_prov_code = '$$servProvCode$$'
  and rec_status = 'A'
  and b1_checkbox_desc = 'Number of Workshop Attendees'
order by rec_date  desc


