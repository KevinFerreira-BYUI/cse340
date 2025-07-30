-- Query 1
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
    VALUES ('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- Query 2
UPDATE public.account SET account_type = 'Admin' WHERE account_firstname = 'Tony';

-- Query 3
DELETE FROM public.account WHERE account_firstname = 'Tony';

-- Query 4
UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') WHERE inv_id = 10;

-- Query 5
SELECT inv_make, inv_model, classification_name FROM public.inventory
    INNER JOIN public.classification
        ON inventory.classification_id = classification.classification_id
	WHERE classification.classification_name = 'Sport';

-- Query 6
UPDATE public.inventory SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'); 
UPDATE public.inventory SET inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

INSERT INTO inventory ( 
	inv_make, 
	inv_model, 
	inv_year, 
	inv_description, 
	inv_image,
	inv_thumbnail,
	inv_price,
	inv_miles,
	inv_color,
	classification_id
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
