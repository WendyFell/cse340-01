INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
	'Tony',
	'Stark',
	'tony@starknet.com',
	'Iam1ronM@n'
);

UPDATE account
SET account_type = "Admin"
WHERE account_id = 1;

DELETE FROM account
WHERE account_id = 1;

UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id =10;

SELECT 
	classification_name,
	inv_make,
	inv_model
FROM inventory i
INNER JOIN classification cl
	ON cl.classification_id = i.classification_id
WHERE classification_name = 'Sport';
