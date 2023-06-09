-- Add Tony Stark
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
-- Change Tony Stark to Admin status
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;
-- Delete Tony Stark
DELETE FROM account
WHERE account_id = 1;
-- Change part of the description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id =10;

-- See a table of just the Sport vehicles with the make and model only
SELECT 
	classification_name,
	inv_make,
	inv_model
FROM inventory i
INNER JOIN classification cl
	ON cl.classification_id = i.classification_id
WHERE classification_name = 'Sport';

-- Update image and thumbnail paths
UPDATE inventory
SET 
	inv_image = REPLACE(
		inv_image,
		'/images/',
		'/images/vehicles/'
	),
	inv_thumbnail = REPLACE (
		inv_image,
		'/images/',
		'/images/vehicles/'
	);

-- messages
INSERT INTO public.message (
	message_subject,
	message_body,
	message_to,
	message_from
)
VALUES (
	'Testing',
	'Need more testing tests',
	'11',
	'13'
);

INSERT INTO public.message (
	message_subject,
	message_body,
	message_to,
	message_from
)
VALUES (
	'Testing',
	'Need more testing tests',
	'11',
	'13'
);

INSERT INTO public.message (
	message_subject,
	message_body,
	message_to,
	message_from,
	message_archived
)
VALUES (
	'Archive Testing',
	'Is the archive working',
	'12',
	'13',
	true
);

INSERT INTO public.message (
	message_subject,
	message_body,
	message_to,
	message_from,
	message_read
)
VALUES (
	'Read Testing',
	'Is the message read working',
	'13',
	'11',
	true
);