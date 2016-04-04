CREATE TABLE only_json(
	field_json json
);

select * from only_json;

insert into only_json values ('{"a": 4}');
insert into only_json values ('{"a":{"b":2}}');
insert into only_json values ('{"a":1, "b":2}');
insert into only_json values ('{"a":[5,6,7,8]}');


select field_json->'a' from only_json;
select field_json->>'a' from only_json;
select field_json->'a'->>'b' from only_json;
select field_json->'a'->>2 from only_json;
select field_json#>>'{a,b}' from only_json;

select * from only_json where field_json->>'a'= '4';

