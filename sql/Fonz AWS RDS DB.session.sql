
-- @block Get users
SELECT * FROM Users

-- @block Create USER
INSERT INTO Users (email, password) 
VALUES ("benji@fonzmusic.com", "password")

--@block Fix Users TABLE
UPDATE Users 
-- SET userId = '7op26c4l5NernSR56LFak4GTmbz1'
-- WHERE email = 'didi@fonzmusic.com'
SET agreedConsent = 1, agreedMarketing = 1;


--@block Update users table
ALTER TABLE Users
ADD agreedConsent TINYINT NOT NULL,
ADD agreedMarketing TINYINT NOT NULL;


-- DROP COLUMN id;
-- DROP PRIMARY KEY,
-- ADD PRIMARY KEY (userId);
-- ADD UNIQUE (userId);

-- MODIFY COLUMN userId SET UNIQUE;
-- ADD userId VARCHAR(28) NOT NULL FIRST;
-- CHANGE COLUMN userId userId NOT NULL VARCHAR(28) AFTER id;
-- ADD passwordSalt VARCHAR(100) AFTER password;
-- ADD userId VARCHAR(28) NOT NULL DEFAULT 'NA'
-- ALTER emailVerified SET DEFAULT 0;
-- MODIFY COLUMN emailVerified BOOLEAN;
-- ADD createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();
-- ADD lastSignedInAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP();


--@block Debug Primary Key
SELECT userId,COUNT(userId)
FROM Users
GROUP BY userId
HAVING COUNT(userId) >1

--@block Get users DESC
DESC Users

--@block Create providers TABLE
CREATE TABLE providers (
    `userId` INT NOT NULL,
    `provider` TEXT NOT NULL,
    `rawId` INT NOT NULL,
    `email` VARCHAR(255),
    `displayName` VARCHAR(255)
);

-- @block Get providers
SELECT * FROM Providers
-- desc providers

-- @block Add user provider
INSERT INTO Providers VALUES (
    1,
    "GOOGLE",
    98765,
    "contact@dermotobrien.me",
    "Dermot"
);

--@block List all Tables
SHOW Tables

--@block Create Sessions Table

--@block Create providers TABLE
CREATE TABLE Sessions (
    `sessionId` VARCHAR(28) NOT NULL,
    `userId` INT NOT NULL,
    `status` TINYINT DEFAULT 1,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    `provider` TEXT NOT NULL
);

--@block Desc Sessions
DESC Sessions;

--@block Insert into Sessions
INSERT INTO Sessions VALUES (
    'UROqkPBzZ1U3YWZfp6HO2AwpkEh1',
    ''
);