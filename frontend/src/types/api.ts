export type severityType = "success" | "error";

export type snackMessageType = {
  message: string;
  severity: severityType;
};
export type SuggestionsType = {
  id: number;
  profile_image: string;
  name: string;
};

export type UserType = {
  username: string;
  id: number;
  profile_image: string;
  profile_name: string;
};

export type authorType = { id: number; username: string; email: string }

export type ProfileInfoType = {
  id: number;
  name: string;
  bio: string;
  created_at: string;
  followingCount: number;
  followersCount: number;
  profile_image: string;
  cover_image: string;
  username: string;
};

export type AuthType = {
  access: string;
  refresh: string;
};

export type PostProfileInfoType = {
  id: number;
  profile_image: string;
  name: string;
};

export type PostType = {
  id: number;
  profile: PostProfileInfoType;
  timestamp: string;
  message: string;
  image: string;
  likes: number;
  isLiked: boolean;
  commentCount: number;
};

export type CommentType = {
  id: number;
  author: string;
  message: string;
  created_at: string;
  profile_image: string;
  first_reply: CommentType;
  isLiked: boolean;
  likes: number;
};

export type ProfileType = {
  id: number;
  name: string;
  city: string;
  state: string;
  bio: string;
  created_at: string;
  following: {
    name: string;
    profile_image: string;
    id: number;
    author: authorType;
  }[];
  followers: {
    name: string;
    profile_image: string;
    id: number;
    author: authorType;
  }[];
  author: authorType;
  profile_image: string;
  cover_image: string;
  posts: PostType[];
};

export type ChatRoomMembersType = {
  'name' : string;
  'id' : number | string 
}

export type  RoomType = {
  'id' : number | string;
  'name' : string;
  'members' : ChatRoomMembersType;
  'unread_message_count' : number
  'last_message' : string;
  'member_name' : string;
  'profileID' : string | number;
  'profile_image' : string;
}

export type chatType = {
  receiver_profile_id : number;
  content : string
}

