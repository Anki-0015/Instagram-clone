package com.instagram.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.instagram.dto.CommentRequest;
import com.instagram.dto.CommentResponse;
import com.instagram.model.Comment;
import com.instagram.model.Post;
import com.instagram.model.User;
import com.instagram.repository.CommentRepository;
import com.instagram.repository.PostRepository;

@Service
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    
    public CommentService(CommentRepository commentRepository, PostRepository postRepository, 
                         UserService userService, NotificationService notificationService) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public CommentResponse createComment(Long postId, CommentRequest commentRequest) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);
        
        comment = commentRepository.save(comment);
        
        // Create notification
        notificationService.createCommentNotification(comment, currentUser);
        
        return new CommentResponse(comment);
    }
    
    public List<CommentResponse> getPostComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        
        return comments.stream()
                .map(CommentResponse::new)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        User currentUser = userService.getCurrentUser();
        
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own comments");
        }
        
        commentRepository.delete(comment);
    }
}
