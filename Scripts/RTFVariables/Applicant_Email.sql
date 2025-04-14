select top 1 c.b1_email
from dbo.b3contact c inner join dbo.b1permit p on (c.serv_prov_code = p.serv_prov_code and c.b1_per_id1 = p.b1_per_id1 and c.b1_per_id2 = p.b1_per_id2 and c.b1_per_id3 = p.b1_per_id3)
where c.b1_per_id1 = '$$capID1$$'
  and c.b1_per_id2 = '$$capID2$$'
  and c.b1_per_id3 = '$$capID3$$'
  and c.serv_prov_code = '$$servProvCode$$'
  and c.b1_contact_type = 'Applicant'
    and c.rec_status = 'A'
