package com.instagram.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.instagram.dto.PostRequest;
import com.instagram.dto.PostResponse;
import com.instagram.model.Post;
import com.instagram.model.User;
import com.instagram.repository.PostRepository;

@Service
public class PostService {
    
    private final PostRepository postRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    
    public PostService(PostRepository postRepository, UserService userService, NotificationService notificationService) {
        this.postRepository = postRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }
    
    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        User currentUser = userService.getCurrentUser();
        
        Post post = new Post();
        post.setImageUrl(postRequest.getImageUrl());
        post.setCaption(postRequest.getCaption());
        post.setUser(currentUser);
        
        post = postRepository.save(post);
        
        PostResponse response = new PostResponse(post);
        response.setLiked(false);
        response.setSaved(currentUser.getSavedPosts().contains(post));
        return response;
    }
    
    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        User currentUser = userService.getCurrentUser();
        PostResponse response = new PostResponse(post);
        response.setLiked(post.getLikes().contains(currentUser));
        response.setSaved(currentUser.getSavedPosts().contains(post));
        
        return response;
    }
    
    public List<PostResponse> getUserPosts(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        User currentUser = userService.getCurrentUser();
        
        return posts.stream()
                .map(post -> {
                    PostResponse response = new PostResponse(post);
                    response.setLiked(post.getLikes().contains(currentUser));
                    response.setSaved(currentUser.getSavedPosts().contains(post));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getFeed() {
        User currentUser = userService.getCurrentUser();
        List<User> following = new ArrayList<>(currentUser.getFollowing());
        following.add(currentUser);
        
        List<Post> posts = postRepository.findPostsByUsers(following);
        
        return posts.stream()
                .map(post -> {
                    PostResponse response = new PostResponse(post);
                    response.setLiked(post.getLikes().contains(currentUser));
                    response.setSaved(currentUser.getSavedPosts().contains(post));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAllOrderByCreatedAtDesc();
        User currentUser = userService.getCurrentUser();
        
        return posts.stream()
                .map(post -> {
                    PostResponse response = new PostResponse(post);
                    response.setLiked(post.getLikes().contains(currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void likePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getCurrentUser();
        
        post.getLikes().add(currentUser);
        currentUser.getLikedPosts().add(post);
        
        postRepository.save(post);
        
        // Create notification
        notificationService.createLikeNotification(post, currentUser);
    }
    
    @Transactional
    public void unlikePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getCurrentUser();
        
        post.getLikes().remove(currentUser);
        currentUser.getLikedPosts().remove(post);
        
        postRepository.save(post);
    }

    @Transactional
    public void savePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getCurrentUser();
        
        currentUser.getSavedPosts().add(post);
        // userRepository is not injected here; saved via owning side flush when transaction ends
    }

    @Transactional
    public void unsavePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getCurrentUser();
        
        currentUser.getSavedPosts().remove(post);
    }

    public List<PostResponse> getSavedPosts() {
        User currentUser = userService.getCurrentUser();
        List<Post> posts = postRepository.findSavedPostsByUser(currentUser);
        return posts.stream().map(p -> {
            PostResponse r = new PostResponse(p);
            r.setLiked(p.getLikes().contains(currentUser));
            r.setSaved(true);
            return r;
        }).collect(Collectors.toList());
    }
    
    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User currentUser = userService.getCurrentUser();
        
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }
        
        postRepository.delete(post);
    }
}
