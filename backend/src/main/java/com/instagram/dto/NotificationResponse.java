package com.instagram.dto;

import java.time.LocalDateTime;

import com.instagram.model.Notification;

public class NotificationResponse {
    private Long id;
    private UserResponse actor;
    private String type;
    private PostResponse post;
    private Long commentId;
    private Boolean isRead;
    private LocalDateTime createdAt;
    
    public NotificationResponse() {}
    
    public NotificationResponse(Notification notification) {
        this.id = notification.getId();
        this.actor = new UserResponse(notification.getActor());
        this.type = notification.getType().name();
        if (notification.getPost() != null) {
            this.post = new PostResponse(notification.getPost());
        }
        if (notification.getComment() != null) {
            this.commentId = notification.getComment().getId();
        }
        this.isRead = notification.getIsRead();
        this.createdAt = notification.getCreatedAt();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public UserResponse getActor() { return actor; }
    public void setActor(UserResponse actor) { this.actor = actor; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public PostResponse getPost() { return post; }
    public void setPost(PostResponse post) { this.post = post; }
    
    public Long getCommentId() { return commentId; }
    public void setCommentId(Long commentId) { this.commentId = commentId; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
