--@block Show Tables
SHOW tables;

--@block Coasters Contents #1002/1002 in database
SELECT * FROM Coasters WHERE coasterId = "0403BB1AE66C81";
--@block Update coasters
UPDATE Coasters SET userId = "b359f3f7-5485-40b3-ba0d-f695bad5b27c" WHERE userId = "3acaa0e4-fa32-46ee-a17b-50d9a08665d4"

--@block Desc Coasters
DESC Coasters;

--@block User Content
SELECT * FROM Users;
--@block Desc Users
DESC Users;

--@block
UPDATE Users SET password = '123456' WHERE email = "DERMOT@test.com"

--@block Drop Users
DROP TABLE Coasters;

--@block Add column
ALTER TABLE MusicProviders
ADD COLUMN provider VARCHAR(255) NOT NULL DEFAULT "Spotify"

--@block clean up
ALTER TABLE Users
DROP COLUMN provider;


--@block Music Providers Content
SELECT * FROM MusicProviders;
--@block DESC Music Providers
DESC musicProviders;

--@block Sessions Content // possibly providerId is calling Provider NOT MusicProviders
-- 2fd1a952-0b8f-4730-aa5c-83150403d0b1
SELECT * FROM Sessions;
--@block DESC Sessions
DESC Sessions;


--@block Get Coasters
SELECT * FROM Coasters;
--@block Desc Coasters
DESC Coasters;

--@block Add Coaster
UPDATE Coasters SET userId = '3acaa0e4-fa32-46ee-a17b-50d9a08665d4' WHERE coasterId = '0409CC1AE66C81';
