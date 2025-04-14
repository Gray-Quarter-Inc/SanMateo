select top 1 concat(a.b1_hse_nbr_start, ' ', iif(b1_str_dir is null, '', concat(b1_str_dir, ' ')), 
b1_str_name, ' ',
iif(b1_str_suffix is null, '', concat(b1_str_suffix, ' ')), 
iif(b1_unit_type is null, '', concat(b1_unit_type, ' ')),
iif(b1_unit_start is null, '', concat(b1_unit_start, ' ')), b1_situs_city, ' ', b1_situs_state, ' ', b1_situs_zip)
from dbo.b3addres a inner join dbo.b1permit p on (a.serv_prov_code = p.serv_prov_code and a.b1_per_id1 = p.b1_per_id1 and a.b1_per_id2 = p.b1_per_id2 and a.b1_per_id3 = p.b1_per_id3)
where  a.b1_per_id1 = '$$capID1$$'
  and a.b1_per_id2 = '$$capID2$$'
  and a.b1_per_id3 = '$$capID3$$'
  and a.serv_prov_code = '$$servProvCode$$'
  and a.rec_status = 'A'
order by b1_primary_addr_flg desc


