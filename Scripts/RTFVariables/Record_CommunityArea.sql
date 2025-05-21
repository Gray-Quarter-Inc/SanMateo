select top 1 a.b1_attribute_value 
from b3parcel p inner join b3apo_attribute a on (p.serv_prov_code = a.serv_prov_code and p.b1_per_id1 = a.b1_per_id1 and p.b1_per_id2 = a.b1_per_id2 
    and p.b1_per_id3 = a.b1_per_id3 and p.b1_parcel_nbr = a.b1_apo_nbr)
where  p.b1_per_id1 = '$$capID1$$'
  and p.b1_per_id2 = '$$capID2$$'
  and p.b1_per_id3 = '$$capID3$$'
  and p.serv_prov_code = '$$servProvCode$$'
  and p.rec_status = 'A'
  and b1_attribute_name = 'COMMUNITY AREA'
order by b1_primary_par_flg desc


