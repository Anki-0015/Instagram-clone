package com.instagram.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.instagram.dto.NotificationResponse;
import com.instagram.model.Comment;
import com.instagram.model.Notification;
import com.instagram.model.Post;
import com.instagram.model.User;
import com.instagram.repository.NotificationRepository;

@Service
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    
    public NotificationService(NotificationRepository notificationRepository, UserService userService) {
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }
    
    @Transactional
    public void createLikeNotification(Post post, User actor) {
        // Don't notify if user likes their own post
        if (post.getUser().getId().equals(actor.getId())) {
            return;
        }
        
        Notification notification = new Notification();
        notification.setUser(post.getUser());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.LIKE);
        notification.setPost(post);
        notification.setIsRead(false);
        
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void createCommentNotification(Comment comment, User actor) {
        // Don't notify if user comments on their own post
        if (comment.getPost().getUser().getId().equals(actor.getId())) {
            return;
        }
        
        Notification notification = new Notification();
        notification.setUser(comment.getPost().getUser());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.COMMENT);
        notification.setPost(comment.getPost());
        notification.setComment(comment);
        notification.setIsRead(false);
        
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void createFollowNotification(User followed, User follower) {
        // Don't notify self-follows (though should be prevented elsewhere)
        if (followed.getId().equals(follower.getId())) {
            return;
        }
        
        Notification notification = new Notification();
        notification.setUser(followed);
        notification.setActor(follower);
        notification.setType(Notification.NotificationType.FOLLOW);
        notification.setIsRead(false);
        
        notificationRepository.save(notification);
    }
    
    public List<NotificationResponse> getNotifications() {
        User currentUser = userService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(currentUser);
        return notifications.stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<NotificationResponse> getUnreadNotifications() {
        User currentUser = userService.getCurrentUser();
        List<Notification> notifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);
        return notifications.stream()
                .map(NotificationResponse::new)
                .collect(Collectors.toList());
    }
    
    public long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countByUserAndIsReadFalse(currentUser);
    }
    
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        User currentUser = userService.getCurrentUser();
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead() {
        User currentUser = userService.getCurrentUser();
        List<Notification> unreadNotifications = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(currentUser);
        
        unreadNotifications.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }
}
