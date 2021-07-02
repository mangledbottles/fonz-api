--@block Show Tables
SHOW tables;

--@block Coasters Contents #1002/1002 in database
SELECT * FROM Coasters;
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
SELECT * FROM Sessions;
--@block DESC Sessions
DESC Sessions;


--@block Get Coasters
SELECT * FROM Coasters;
--@block Desc Coasters
DESC Coasters;