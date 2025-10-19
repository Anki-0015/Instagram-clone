package com.instagram.dto;

import com.instagram.model.Post;

import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String imageUrl;
    private String caption;
    private UserResponse user;
    private int likesCount;
    private int commentsCount;
    private boolean isLiked;
    private LocalDateTime createdAt;

    public PostResponse() {
    }

    public PostResponse(Post post) {
        this.id = post.getId();
        this.imageUrl = post.getImageUrl();
        this.caption = post.getCaption();
        this.user = new UserResponse(post.getUser());
        this.likesCount = post.getLikes().size();
        this.commentsCount = post.getComments().size();
        this.createdAt = post.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
    public UserResponse getUser() { return user; }
    public void setUser(UserResponse user) { this.user = user; }
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }
    public boolean isLiked() { return isLiked; }
    public void setLiked(boolean liked) { isLiked = liked; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
