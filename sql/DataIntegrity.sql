--@block Show Tables
SHOW Tables;

--@block Coasters Contents #1002/1002 in database
SELECT * FROM Coasters;

--@block User Content
SELECT * FROM Users;
--@block Desc Users
DESC Users;

--@block Music Providers Content
SELECT * FROM MusicProviders;
--@block DESC Music Providers
DESC MusicProviders;

--@block Sessions Content // possibly providerId is calling Provider NOT MusicProviders
SELECT * FROM Sessions;
--@block DESC Sessions
DESC Sessions;
