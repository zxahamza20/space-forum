# Web Development Final Project - *space-forum*

Submitted by: **Hamza Munis**

This web app: **Is a platform where users can create, upvote, comment on, and repost space-themed discussions, with automatic NASA API integration that enriches posts with stunning cosmic imagery in picture of the day or other topics like black holes, mars, moon etc. Built with React and Supabase, it features pseudo-authentication, and threaded discussions for space enthusiasts to share and explore interstellar topics together.**

Time spent: **48** hours spent in total

## Required Features

The following **required** functionality is completed:

- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:

- [x] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [x] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [-] Users can customize the interface (not implemented)
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [x] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [x] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] N/A

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with Kap [MacOS]  

### Production Images

**Home Page (p1)**
<img src='https://i.imgur.com/RZcjoNx.png' title='Home Page (p1)' width='' alt='Home Page (p1)' />

**Home Page (p2)**
<img src='https://i.imgur.com/9knLxbQ.png' title='Home Page (p2)' width='' alt='Home Page (p2)' />

**View Post (p1)**
<img src='https://i.imgur.com/RPGYUWl.png' title='View Post (p1)' width='' alt='View Post (p1)' />

**View Post (p2)**
<img src='https://i.imgur.com/S7YymLD.png' title='View Post (p2)' width='' alt='View Post (p2)' />

**Create Post (p1)**
<img src='https://i.imgur.com/KW0r3lv.png' title='Create Post (p1)' width='' alt='Create Post (p1)' />

**Create Post (p2)**
<img src='https://i.imgur.com/1jgX3Z9.png' title='Create Post (p2)' width='' alt='Create Post (p2)' />

**Edit Post (p1)**
<img src='https://i.imgur.com/m9W6Eon.png' title='Edit Post (p1)' width='' alt='Edit Post (p1)' />

**Edit Post (p2)**
<img src='https://i.imgur.com/SnZBNG5.png' title='Edit Post (p2)' width='' alt='Edit Post (p2)' />

**Delete Post (p1)**
<img src='https://i.imgur.com/A4SN4Eq.png' title='Delete Post (p1)' width='' alt='Delete Post (p1)' />

**Delete Post (p2)**
<img src='https://i.imgur.com/CX6JNPl.png' title='Delete Post (p2)' width='' alt='Delete Post (p2)' />

**Filter By Flag (Question)**
<img src='https://i.imgur.com/kPs8UcF.png' title='Filter By Flag (Question)' width='' alt='Filter By Flag (Question)' />

**Filter By Flag (opinion)**
<img src='https://i.imgur.com/UWBykfX.png' title='Filter By Flag (Opinion)' width='' alt='Filter By Flag (Opinion)' />

**Filter By Flag (Discussion)**
<img src='https://i.imgur.com/NUZ3xKX.png' title='Filter By Flag (Discussion)' width='' alt='Filter By Flag (Discussion)' />

**Filter By Flag (Media/Discovery)**
<img src='https://i.imgur.com/6m6yMii.png' title='Filter By Flag (Media/Discovery)' width='' alt='Filter By Flag (Media/Discovery)' />

**Sort by Newest (Default) (Date of creation)**
<img src='https://i.imgur.com/RZcjoNx.png' title='Sort by Newest (Default) (Date of creation)' width='' alt='Sort by Newest (Default) (Date of creation)' />

**Sort by Most popular (Most Upvotes)**
<img src='https://i.imgur.com/0e7X5Td.png' title='Sort by Most popular (Most Upvotes)' width='' alt='Sort by Most popular (Most Upvotes)' />

**Repost (p1)**
<img src='https://i.imgur.com/q5gSj4h.png' title='Repost (p1)' width='' alt='Repost (p1)' />

**Repost (p2)**
<img src='https://i.imgur.com/q1sTdc5.png' title='Repost (p2)' width='' alt='Repost (p2)' />

**Search for a post to view**
<img src='https://i.imgur.com/U4bK9PJ.png' title='Search for a post to view' width='' alt='Search for a post to view' />

**NASA API integration (Picture of the Day)**
<img src='https://i.imgur.com/16EO9AO.png' title='NASA API integration (Picture of the Day)' width='' alt='NASA API integration (Picture of the Day)' />

**NASA API integration (Random Topics)**
<img src='https://i.imgur.com/P6PoztF.png' title='NASA API integration (Random Topics)' width='' alt='NASA API integration (Random Topics)' />

**Upload from System**
<img src='https://i.imgur.com/VBDOEmY.png' title='Upload from System' width='' alt='Upload from System' />

## Notes

1. The biggest challenge was Implementing the "Users can customize the interface" feature. despite AI's help, I was having a hard time implementing the feature. My goal was to add 3 things: 
    1.1 Feed Density
    Compact View: Show only title, author, and upvotes (current default)
    Comfortable View: Add slightly more padding and spacing between posts
    Expanded View: Show full content, images, and media previews directly in the feed

    1.2 Post Card Layout
    Card vs List: Toggle between card-based layout and list-based layout
    Grid vs Stack: Show posts in a grid (2-3 columns) or vertical stack
    Thumbnail Position: Move media thumbnails to left, right, top, or hide them

    1.3 Change color modes:
    Users can toggle between color modes (not light or dark mode but different color combos including default(the current one))

adding different color modes was the easy part but the other 2 I could not figure out and because of time constraints, I could not work on it any longer so I had to abandon this stretch feature for now. I will add this in the future however. (Any suggestions on how i can approach this are welcome)

2. the secopnd challenge was implementing the psuedo authentication. i somehow managed to implement it by manual ID entering, as in user sets a secret key and that key is used to allow the "Admin" to delete posts. The user is assignex a dummy ID. However, it is only for show

3. The reposting feature also gave me a hard time because I cpuldnt figure out how to thread the discussion. Earlier on, it reposted but did nothing. however now reposting shows the parent post in details page and users can comment on the reposted post as well.

**Deployed App Link:** https://space-forum.netlify.app/

## License

    Copyright [2026] [Hamza Munis]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
