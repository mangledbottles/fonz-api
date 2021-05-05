# AWS

### TODO:
- [ ] [Creating an Amazon Machine Image](#creating-an-amazon-machine-image)
- [ ] User Auth Export
  - [x] Export raw data
  - [ ] Manage password hash
  - [ ] [3rd party sign-in](#3rd-party-sign-in)




#### Creating an Amazon Machine Image
- After you install Node.js on an Amazon EC2 instance, you can create an Amazon Machine Image (AMI) from that instance. 
- Creating an AMI makes it easy to provision multiple Amazon EC2 instances with the same Node.js installation. For more information about creating an AMI from an existing instance, see Creating an Amazon EBS-Backed Linux AMI in the Amazon EC2 User Guide for Linux Instances.
- https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node-on-ec2-instance.html

### 3rd Party Sign-in
- Users have created accounts with Google, Apple, Anonymous
- Google and Apple sign in are done through an affiliated developer account
  - That affiliated developer is Google....