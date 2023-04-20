Table User {
User_id int
User_type int
name string
email string
password_hash string
posts_id int

Indexes {
(User_id) [pk]
}
}

Table Student {
User_id int
Student_id int

Indexes {
(Student_id) [pk]
}
}



Table Society_member {
User_id int
member_id int
membership int

Indexes {
(member_id) [pk]
}
}


Table Admin {
User_id int
Admin_id int

Indexes {
(Admin_id) [pk]
}
}


Table Society {
  Society_id int
  membership int
  posts_id int
  
  indexes {
    (Society_id) [pk]
  }
}


Table Posts {
  posts_id int
  title string
  content string
  user_id int
  indexes {
    (posts_id) [pk]
  }
}

Table Society_membership {
  Society_id int
  member_id int
  joined bool
}

Table Interactions{
  post_id int
  comment string
  user_id int
  liked bool
}

table events{
  events_id int
  name string
  society_id string
  date date
}

table event_attendance{
  event_id int
  user_id int
}

Ref: "User"."posts_id" < "Posts"."posts_id"

Ref: "Society"."posts_id" < "Posts"."posts_id"

Ref: "Society_membership"."member_id" < "Society_member"."member_id"

Ref: "Society_membership"."Society_id" < "Society"."Society_id"

Ref: "User"."User_id" - "Student"."User_id"

Ref: "User"."User_id" - "Admin"."User_id"

Ref: "User"."User_id" - "Society_member"."User_id"

Ref: "User"."User_id" < "Interactions"."user_id"

Ref: "Posts"."posts_id" < "Interactions"."post_id"

Ref: "Society"."Society_id" < "events"."society_id"

Ref: "events"."events_id" < "event_attendance"."event_id"