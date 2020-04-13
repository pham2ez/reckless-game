// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => preParent.classList.remove('flashing'), 300);
}

// Axios responses have a lot of data. This shows only the most relevant data.
function showResponse(axiosResponse) {
  const fullResponse = axiosResponse.response === undefined
    ? axiosResponse
    : axiosResponse.response;
  const abridgedResponse = {
    data: fullResponse.data,
    status: fullResponse.status,
    statusText: fullResponse.statusText,
  };
  showObject(abridgedResponse);
}

// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE

// EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

/**
 * You can use axios to make API calls like this:
 * const body = { bar: 'baz' };
 * axios.post('/api/foo', body)
 *   .then(showResponse) // on success (Status Code 200)
 *   .catch(showResponse); // on failure (Other Status Code)
 * See https://github.com/axios/axios for more info
 */

// Hint: do not assume a 1:1 mapping between forms and routes

function createUser(fields) {
  axios.post('/api/user', fields)
    .then(showResponse)
    .catch(showResponse);
}

function changeUsername(fields) {
  axios.put('/api/user/username', fields)
    .then(showResponse)
    .catch(showResponse);
}

function changePassword(fields) {
  axios.put('/api/user/password', fields)
    .then(showResponse)
    .catch(showResponse);
}

function deleteUser(fields) {
  axios.delete('/api/user', fields)
    .then(showResponse)
    .catch(showResponse);
}

function signIn(fields) {
  axios.post('/api/user/signin', fields)
    .then(showResponse)
    .catch(showResponse);
}

function signOut(fields) {
  axios.delete('/api/user/signout', fields)
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFreetsRecent(fields) {
  axios.get('/api/freet/recent/all', fields)
    .then(showResponse)
    .catch(showResponse);
}

function viewAllFreetsPopular(fields) {
  axios.get('/api/freet/popular/all', fields)
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthorRecent(fields) {
  axios.get('/api/freet/recent/' + fields.author, fields)
    .then(showResponse)
    .catch(showResponse);
}

function viewFreetsByAuthorPopular(fields) {
  axios.get('/api/freet/popular/'+fields.author, fields)
    .then(showResponse)
    .catch(showResponse);
}

function createFreet(fields) {
  axios.post('/api/freet', fields)
    .then(showResponse)
    .catch(showResponse);
}

function editFreet(fields) {
  axios.put('/api/freet/' + fields.id, fields)
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreet(fields) {
  axios.delete('/api/freet/' + fields.id, fields)
    .then(showResponse)
    .catch(showResponse);
}

function reFreet(fields) {
  axios.post('/api/freet/refreet/' + fields.id, fields)
    .then(showResponse)
    .catch(showResponse);
}

function followUser(fields) {
  axios.put('/api/user/follow/' + fields.username, fields)
    .then(showResponse)
    .catch(showResponse);
}

function unfollowUser(fields) {
  axios.put('/api/user/unfollow/' + fields.username , fields)
    .then(showResponse)
    .catch(showResponse);
}

function upvoteFreet(fields) {
  axios.put('/api/freet/upvote/' + fields.id , fields)
    .then(showResponse)
    .catch(showResponse);
}

function unupvoteFreet(fields) {
  axios.put('/api/freet/unupvote/' + fields.id , fields)
    .then(showResponse)
    .catch(showResponse);
}

function showFeedRecent(fields) {
  axios.get('/api/freet/recent/feed', fields)
    .then(showResponse)
    .catch(showResponse);
}

function showFeedPopular(fields) {
  axios.get('/api/freet/popular/feed', fields)
    .then(showResponse)
    .catch(showResponse);
}

function followers(fields) {
  axios.get('/api/user/followers', fields)
    .then(showResponse)
    .catch(showResponse);
}

function following(fields) {
  axios.get('/api/user/following', fields)
    .then(showResponse)
    .catch(showResponse);
}
// IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE BELOW

// map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets-recent': viewAllFreetsRecent,
  'view-all-freets-popular': viewAllFreetsPopular,
  'view-freets-by-author-recent': viewFreetsByAuthorRecent,
  'view-freets-by-author-popular': viewFreetsByAuthorPopular,
  'show-feed-recent': showFeedRecent,
  'show-feed-popular': showFeedPopular,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'upvote-freet': upvoteFreet,
  'unupvote-freet': unupvoteFreet,
  'refreet': reFreet,
  'followers': followers,
  'following': following,
};

// attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {};
      (new FormData(form)).forEach((value, key) => {
        data[key] = value;
      });
      handler(data);
      return false; // don't reload page
    };
  });
}

window.onload = init; // attach handlers once DOM is ready
