# FED1 Project Exam 1

This is my Project Exam for Front-End Developer course year 1 at Noroff.

Project Brief:

  This is a blogging application that allows users to view dynamic block posts.
The client requires admin pages to register, login and manage their blog posts.

Theme/Client:

  A website called Mum, how do I..? The posts will be about family recipes that have been passed down
by generations for readers to try them out and get the same feeling of when they have the need to call
their mother to ask "Mum, how do I..?"

User stories:

  Blog Feed page
  - As a user, I want to see an interactive banner carousel on the blog feed page, so that
I can view a rotation of the 3 latest posts.
  - As a user, I want to click on a button for each carousel item, taking me to the blog
post page to read more.
  - As a user, I want to click on the previous or next button in the carousel to animate
and reveal another post, to ensure I can see different posts easily.
  - As a user, I want the carousel to return to the first post after reaching the end of the
list, and vice versa when clicking previous on the first post.
  - As a user, I want to view a static list of the 12 latest posts in a responsive thumbnail
grid on the blog feed page, so I can easily select which post to read.
  - As a user, I want each thumbnail in the blog post feed to be clickable, taking me to
the blog post page to read more.

  Block Post Public Page
  - As a user, I want to see a responsive layout showing the post title, author,
publication date, image banner, and post content from the API.
  - s a user, I want each blog page to have a shareable URL including a query string or
hash parameter that contains the post ID, so I can share the post with others easily.

  Blog Post Edit Page
  - As the owner, I want the blog post edit page to be available only for me when logged
in, to ensure no unauthorized edits can be made to my posts.
  - As the owner, I want a delete button that sends a DELETE request to the API for this
post ID on the edit page, so I can easily remove my post if needed.
  - As the owner, I want a validated edit form that allows me to update the title, body
content, or image by sending a POST request to the API for this post ID, ensuring I
can keep my posts up to date easily.

  Abbount Login Page
  - As the owner, I want a validated login form that allows me to request and save a
token to my browser by entering my email and password, allowing me to manage
posts.

  Account Register Page
  - As the owner, I want a validated register form that allows me to create a new
account by entering my name, email and password.

Sitemap:

  - /index.html (Blog Feed Page)
  - /post/index.html (Blog Post Public Page)
  - /post/edit.html (Blog Post Edit Page)
  - /account/login.html (Account Login Page)
  - /account/register.html (Account Register Page)
  

site is deployed on: https://mumhowdoi.netlify.app
