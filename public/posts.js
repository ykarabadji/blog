const BaseApi = 'http://localhost:3636';
const token = localStorage.getItem('token');  // Replace 'token' with the actual key name you used to store it
let is_editing = false;

// Function to fetch posts from the backend
async function fetch_Posts(){
  const title = document.getElementById('postTitle');
  const content = document.getElementById('postContent');
  title.value = '';
  content.value = '';
    try {
        const response = await fetch(`${BaseApi}/fetching/posts`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

       

        const posts = await response.json();
        if(posts.message === 'Post not found or not authorized'){
          render_Posts([]);
          return ;
        }
        const all_posts = posts.allPosts
        console.log(all_posts);
        render_Posts(all_posts);  // Pass the fetched posts to render function
    } catch (error) {
        console.error('Error in fetch_Posts function:', error);
        alert('Error fetching posts. Please check the console for details.');
    }
}

// Function to render the fetched posts
async function render_Posts(all_posts) {
   
  const posts_Container = document.getElementById('postsContainer');
  try {
    if (!Array.isArray(all_posts) || all_posts.length === 0) {
      posts_Container.innerHTML = '<p>No posts available.</p>'; // Display a message if no posts
      return;
  }
      console.log('Posts:', all_posts);  // Log the posts data to see its structure
      posts_Container.innerHTML = ''; // Clear previous posts before rendering new ones
      all_posts.forEach(post => {
          const post_id = post.id;
          const postElement = document.createElement('div');
          postElement.classList.add('post-container');
          postElement.innerHTML = `
              <div class="post-header">
                  <h3>${post.title}</h3>
                  <p class="post-date">${post.createdDate}</p>
              </div>
              <div class="post-content">${post.content}</div>
          
              <div class="post-actions">
                  <button onclick="edit_post('${post_id}')" class="edit-btn">✏️ Edit</button>
                  <button onclick="delete_Post('${post_id}')" class="delete-btn">🗑️ Delete</button>
              </div>
          `;
          posts_Container.appendChild(postElement);
          
      });
      
  } catch (error) {
      console.error('Error rendering posts:', error);
      alert('Error rendering posts');
  }
}


// Function to add a new post
async function handle_Post(event) {
    event.preventDefault();  // Prevent page reload
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();

    if (!title || !content) {
        alert('Title and content cannot be empty');
        return;
    }

    if (!is_editing) {
        // Add mode
        try {
            const response = await fetch(`${BaseApi}/fetching/posts/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) {
                console.log('Response status:', response.status);
                console.log('Response text:', await response.text());
                alert('There was an error creating the post');
                return;
            }
            fetch_Posts(); // Refresh posts after creation
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Cannot create a post. Please try again later.');
        }
    } else {
        // Edit mode
        try {
            const response = await fetch(`${BaseApi}/fetching/posts/edit2/${currentEditingPostId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content })
            });
            if (!response.ok) {
                console.log('Response status:', response.status);
                console.log('Response text:', await response.text());
                alert('There was an error updating the post');
                return;
            }
            // Reset edit mode
            is_editing = false;
            currentEditingPostId = null;
           
            // Optionally reset button text
            document.getElementById('submit-button').innerText = 'Publish';
            fetch_Posts(); // Refresh posts after updating
            exit_edit();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Cannot update the post. Please try again later.');
        }
    }
}

    
    async function delete_Post(post_id){
        
      
       const response =  await fetch(`${BaseApi}/fetching/posts/delete/${post_id}`, {
          method : 'DELETE',
          headers: {
          
            'Authorization': `Bearer ${token}`,


          }})
         if(!response.ok){
          alert('error fecthing ');
         }
        fetch_Posts();
         
      
    }

    async function edit_post(post_id) {
        try {
            const response = await fetch(`${BaseApi}/fetching/posts/edit/${post_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                alert('Error fetching post for editing');
                return;
            }
            const data = await response.json();
            // Set edit mode and store the id
            is_editing = true;
            currentEditingPostId = post_id;
            // Populate the form fields
            document.getElementById('postTitle').value = data.post.title;
            document.getElementById('postContent').value = data.post.content;
            // Optionally change the button text
            document.getElementById('submit-button').innerText = 'Edit Post';
            let button = document.createElement('button');
            button.id = 'exit-button';
            button.textContent = '❌ Cancel';
            button.onclick = exit_edit;
            button.style = `
                background-color: #f39c12; 
                color: white; 
                border: none; 
                padding: 8px 12px; 
                font-size: 14px; 
                cursor: pointer; 
                border-radius: 5px; 
                transition: 0.3s;
                margin-top: 10px;
            `;
            document.getElementById('main-con').appendChild(button);
            
        } catch (error) {
            alert('Failed to fetch post for editing');
            console.error('Error:', error);
        }
    }
    async function exit_edit(){
        is_editing = false;
        currentEditingPostId = null;
        document.getElementById('submit-button').innerText = 'Publish';
        let button = document.getElementById('exit-button');
        document.getElementById('main-con').removeChild(button);
        document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';

    }
     

  fetch_Posts()