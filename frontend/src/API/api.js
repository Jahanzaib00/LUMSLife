import axios from "axios";

export let url = `/api`;

//the data returned by a function can be accessed by using .data on the object

// create a new account of account_type with the specified email and password
// returns a json object containing "is_succesful" and "account_ID" / "error_message"
export async function signup(email, password, username, accountType) {
  const request = {
    email: email,
    password: password,
    name: username,
    accountType: accountType,
  };

  return await axios.post(`${url}/general/signup`, request);
}

// login to an existing account with the specified email and password
// return a json object containing "is_succesful" and "account_ID" / "error_message"
export async function login(email, password, accountType) {
  const request = {
    email: email,
    password: password,
    accountType: accountType,
  };

  return await axios.post(`${url}/general/login`, request);
}

export async function validateEmail(email) {
  const request = {
    email: email,
  };

  return await axios.post(`${url}/general/validateEmail`, request);
}

export async function createPost(formData) {
  return await axios.post(`${url}/society/event/create-post`, formData);
}

export async function emailVerification(email, otp) {
  const request = {
    email: email,
    otp: otp,
  };
  return await axios.post(`${url}/general/verify-email`, request);
}

//Remove a student account associated with a specific student id
// return a json object containing is_succesful / error_message
export async function removeStudentAccount(Student_id) {
  const request = {
    Student_id: Student_id,
  };

  return await axios.post(`${url}/admin/removeStudentAccount`, request);
}

//Remove a society account associated with a specific society id
// return a json object containing is_succesful / error_message
export async function removeSocietyAccount(Society_id) {
  const request = {
    Society_id: Society_id,
  };

  return await axios.post(`${url}/admin/removeSocietyAccount`, request);
}

//Get all posts from the backend for homepage
export async function getHomeFeed() {
  return await axios.get(`${url}/general/getHomeFeed`);
}

export async function interact_post(post_id, user_id, liked, comment) {
  const request = {
    post_id: post_id,
    user_id: user_id,
    liked: liked,
    comment: comment,
  };

  return await axios.post(`${url}/student/interact_post`, request);
}

export async function bookEvent(post_id, user_id) {
  const request = {
    post_id: post_id,
    user_id: user_id,
  };

  return await axios.post(`${url}/student/bookEvent`, request);
}
