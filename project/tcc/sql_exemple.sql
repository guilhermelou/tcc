WITH reports(data) AS (
   VALUES ('{"objects":[{"src":"foo.png"}, {"src":"bar.png"}]
           , "background":"background.png"}'::json)
   ) 
SELECT *
FROM   reports r, json_array_elements(r.data#>'{objects}') obj
WHERE  obj->>'src' = 'foo.png';
                                      
SELECT name FROM rainfall_station st, jsonb_array_elements(st.years) st_years
WHERE (st_years->>'average')::float = 28.745205479452054
                                      
WITH years_data AS(
	SELECT name, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years)

SELECT name FROM years_data WHERE (st_years->>'average')::float = 28.745205479452054
                                      
WITH months_data AS(
	SELECT name, st_years->'months' as months FROM rainfall_station st, jsonb_array_elements(st.years) st_years
)
SELECT name FROM months_data m_data, jsonb_array_elements(m_data.months) st_months WHERE (st_months->>'average')::float = 81.80645161290323

WITH years_data AS(
		SELECT name, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years
	)
SELECT name FROM years_data WHERE (st_years->>'average')::float = 28.745205479452054
                       
WITH years_data AS(
		SELECT name, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years
	),
     months_data AS(
     	SELECT name, st_months FROM years_data, jsonb_array_elements(st_years->'months') st_months
     )
SELECT name FROM months_data WHERE (st_months->>'average')::float = 81.80645161290323
                                      
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years
	),
     months_data AS(
     	SELECT name, id, st_months FROM years_data, jsonb_array_elements(st_years->'months') st_months
     ),
     days_data AS(
     	SELECT name, id, st_days FROM months_data, jsonb_array_elements(st_months->'days') st_days 
     )
SELECT DISTINCT ON (id) id, name FROM days_data WHERE (st_days->>'day_average')::float = 20
                                      
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>'year')::int = 1959
	),
     months_data AS(
     	SELECT name, id, st_months FROM years_data, jsonb_array_elements(st_years->'months') st_months
     ),
     days_data AS(
     	SELECT name, id, st_days FROM months_data, jsonb_array_elements(st_months->'days') st_days 
     )
SELECT DISTINCT ON (id) id, name FROM days_data WHERE (st_days->>'day_average')::float = 20
                                      
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>'year')::int = 1959
	),
     days_data AS(
     	SELECT name, id, st_days FROM years_data, jsonb_array_elements(st_years->'months'->0->'days') st_days 
     )
SELECT DISTINCT ON (id) id, name FROM days_data WHERE (st_days->>'day_average')::float = 20
                                  
                                 
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>'year')::int = 1959
	)
SELECT DISTINCT ON (id) id, name FROM years_data WHERE (st_years->>'average')::float > 50
                                      
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>'year')::int = 1959
	)
SELECT DISTINCT ON (id) id, name FROM years_data WHERE (st_years->'months'->5->>'average')::float = 20 
                                      
WITH years_data AS(
		SELECT name, id, st_years FROM rainfall_station st, jsonb_array_elements(st.years) st_years where (st_years->>'year')::int = 1959
	)
SELECT DISTINCT ON (id) id, name FROM years_data WHERE (st_years->'months'->5->'days'->15->>'day_average')::float > 10 
                                      
                                      
                                      

                                      
SELECT name FROM rainfall_station st WHERE (st.years->>'average')::float = 28.745205479452054
SELECT name FROM rainfall_station st WHERE (st.years->0->>'average')::float = 28.745205479452054

                                      
                                      
                                      
                                      
                                      
                                      
