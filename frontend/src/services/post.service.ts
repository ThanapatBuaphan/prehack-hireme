import api from "./api";

export interface Post {
  id: number;
  jobtitle: string;
  location: string;
  requirements: string;
  Salary: number;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { applies: number };
}

export interface CreatePostPayload {
  jobtitle: string;
  location: string;
  requirements: string;
  Salary: number;
  description?: string;
}

export interface UpdatePostPayload extends Partial<CreatePostPayload> {}

export const postService = {
  async getMyPosts(): Promise<Post[]> {
    const { data } = await api.get("/api/company/posts");
    return data.posts;
  },

  async createPost(payload: CreatePostPayload): Promise<Post> {
    const { data } = await api.post("/api/company/posts", payload);
    return data.post;
  },

  async updatePost(id: number, payload: UpdatePostPayload): Promise<Post> {
    const { data } = await api.patch(`/api/company/posts/${id}`, payload);
    return data.post;
  },

  async deletePost(id: number): Promise<void> {
    await api.delete(`/api/company/posts/${id}`);
  },
};