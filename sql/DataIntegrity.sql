--@block Show Tables
SHOW tables;

--@block Coasters Contents #1002/1002 in database
SELECT * FROM Coasters;
--@block Update coasters
UPDATE Coasters SET userId = "b359f3f7-5485-40b3-ba0d-f695bad5b27c" WHERE userId = "3acaa0e4-fa32-46ee-a17b-50d9a08665d4"

--@block Desc Coasters
DESC Coasters;

--@block User Content
SELECT * FROM Users;
--@block Desc Users
DESC Users;

--@block
DROP TABLE Users;

--@block Drop Users
-- SET FOREIGN_KEY_CHECKS = 0;
-- DELETE FROM MusicProviders;
-- SET FOREIGN_KEY_CHECKS = 1;
-- DELETE FROM Users;

--@block Add column
ALTER TABLE MusicProviders
ADD COLUMN provider VARCHAR(255) NOT NULL DEFAULT "Spotify"

--@block Remove redundant MusicProviders
DELETE FROM MusicProviders;

--@block Update Music Providers
UPDATE MusicProviders SET userId = "b359f3f7-5485-40b3-ba0d-f695bad5b27c";

--@block clean up
ALTER TABLE Users
DROP COLUMN provider;


--@block Music Providers Content
SELECT * FROM MusicProviders;
--@block DESC Music Providers
DESC MusicProviders;

--@block Delete Music Providers
DELETE FROM MusicProviders WHERE userId = "b2e9ba47-b898-4a59-bc25-54a5fca7c23e";

--@block Sessions Content // possibly providerId is calling Provider NOT MusicProviders
-- 2fd1a952-0b8f-4730-aa5c-83150403d0b1
SELECT * FROM Sessions;
--@block DESC Sessions
DESC Sessions;

--@block Delete Sessions
DELETE FROM Sessions WHERE userId = "b2e9ba47-b898-4a59-bc25-54a5fca7c23e";

--@block Update Sessions
UPDATE Sessions SET active = 1;


--@block Get Coasters
SELECT * FROM Coasters;
--@block Desc Coasters
DESC Coasters;

--@block Add Coaster
UPDATE Coasters SET userId = '3acaa0e4-fa32-46ee-a17b-50d9a08665d4' WHERE coasterId = '0409CC1AE66C81';
