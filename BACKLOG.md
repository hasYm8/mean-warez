# Application Backlog
> **Version:** 1.0.5

This document outlines the features, improvements, and bug fixes planned for the Warez MEAN stack application. Items are generally prioritized, but this is a living document and priorities may shift.

## Backlog Items

### High Priority

* [X] **[Feature]** Create Dockerfiles; create dev and prod compose profiles; fix env variables
* [X] **[Feature]** Use nginx instead of angular's development server in prod environment
* [X] **[Feature]** Registration / Login (with session)
* [X] **[Feature]** Implement these roles: Admin, Uploader, User
  * **Admin**:
    * create or modify categories (e.g. software, game, movie, music)
    * supervise uploads
    * modify user comments
    * delete users
    * modify website's safety features
  * **Uploader**:
    * upload content (must give title, description and category)
  * **User**:
    * search and download content
    * comment and rate uploaded contents
* [X] **[Feature]** Design and implement basic pages without real functionality
* [X] **[Feature]** Design and implement content upload page
* [X] **[Feature]** Design and implement content list page
* [X] **[Feature]** Design and implement content view / download page
* [X] **[Feature]** Implement every role functionality
* [ ] **[Feature]** Implement categories
* [X] **[Feature]** Implement admin features

### Medium Priority

* [ ] **[Feature]** Make password updateable on profile page
* [X] **[Feature]** Refact forms on registration and login page
* [X] **[Feature]** MongoDB should have minimum 4 collections
* [ ] **[Feature]** MongoDB should have test data in it on startup

### Low Priority

* [ ] **[Feature]** ReadME should be up to date at end of the project
* [ ] **[Feature]** AuthGuard required roles should be fixed at end of the project
