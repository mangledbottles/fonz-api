# AWS

### TODO:
- [ ] [Creating an Amazon Machine Image](#creating-an-amazon-machine-image)
  - [x] Setup pipeline
    - [x] Build scheduler (Monday at 9:00 UTC)
    - [x] Create image based on configured Linux EC2 server AMI ID #ami-08bac620dc84221eb
    - [x] Initialise storage volumes for auto-expansion
    - [x] Create component for AMI recipe
      - [x] Create test component to configure
        - ARN arn:aws:imagebuilder:eu-west-1:941145422188:component/fonz-test-component/x.x.x
    - [x] Setup distribution settings
      - [x] Create EU-WEST-1 Region (Ireland server)
      - [x] Create US-EAST-2 Region (Ohio server)
- [ ] User Auth Export
  - [x] Export raw data
  - [ ] Manage password hash
  - [ ] [3rd party sign-in](#3rd-party-sign-in)
- [ ] [Github auto-deploy to AWS](#github-auto-deploy-to-aws)
  - [ ] Read up more about this
  - [x] Deploy initial setup
  - [x] Create first official release
  - [ ] Configure GH WorkFlows with AWS correctly
  - [ ] Manage flow of updates, downtime and security issues
- [ ] Repository Restructure
  - [ ] Clean up all the files and folders
  - [ ] Remove unnecesary files
- [ ] [Conversion from Firebase to AWS](#moving-from-firebase-to-aws)



#### Creating an Amazon Machine Image
- After you install Node.js on an Amazon EC2 instance, you can create an Amazon Machine Image (AMI) from that instance. 
- Creating an AMI makes it easy to provision multiple Amazon EC2 instances with the same Node.js installation. For more information about creating an AMI from an existing instance, see Creating an Amazon EBS-Backed Linux AMI in the Amazon EC2 User Guide for Linux Instances.
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

#### 3rd Party Sign-in
- Users have created accounts with Google, Apple, Anonymous
- Google and Apple sign in are done through an affiliated developer account
  - That affiliated developer is Google....

#### Github Auto-Deploy to AWS
- All changes to the API will be done in a **new branch**
- Once this branch is turned into a PR and approved, it is merged into the master branch
- Looking into the possibility of using GitHub *releases* to manage redeployment
- Otherwise, whenever there is a change to main, using GH WorkFlows, deploy the new API on AWS

#### Moving from Firebase to AWS
- There are a lot of changes happening with how the API is managed

**Currently** 
| Function | Name |
| --- | --- |
| Database|  [GCP](#gcp) Firebase Firestore NoSQL |
| Server | [GCP](#gcp) Firebase Serverless Functions |

**Future** 
| Function | Name |
| --- | --- |
| Database|  [AWS](#aws) Multi-Region MySQL RDS Aurora Serverless |
| Server | [AWS](#aws) Multi-Region EC2 scaling with AMI |



#### Terminology
##### GCP
- Google Cloud Platform
- https://cloud.google.com

##### AWS
- Amazon Web Services
- https://aws.amazon.com