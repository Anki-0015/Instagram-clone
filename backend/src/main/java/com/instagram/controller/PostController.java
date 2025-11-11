package com.instagram.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.instagram.dto.MessageResponse;
import com.instagram.dto.PostRequest;
import com.instagram.dto.PostResponse;
import com.instagram.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    
    private final PostService postService;
    public PostController(PostService postService) {
        this.postService = postService;
    }
    
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest) {
        return ResponseEntity.ok(postService.createPost(postRequest));
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPost(postId));
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }
    
    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed() {
        return ResponseEntity.ok(postService.getFeed());
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/saved")
    public ResponseEntity<List<PostResponse>> getSavedPosts() {
        return ResponseEntity.ok(postService.getSavedPosts());
    }
    
    @PostMapping("/{postId}/like")
    public ResponseEntity<MessageResponse> likePost(@PathVariable Long postId) {
        postService.likePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post liked successfully"));
    }
    
    @DeleteMapping("/{postId}/like")
    public ResponseEntity<MessageResponse> unlikePost(@PathVariable Long postId) {
        postService.unlikePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post unliked successfully"));
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<MessageResponse> savePost(@PathVariable Long postId) {
        postService.savePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post saved successfully"));
    }

    @DeleteMapping("/{postId}/save")
    public ResponseEntity<MessageResponse> unsavePost(@PathVariable Long postId) {
        postService.unsavePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post unsaved successfully"));
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<MessageResponse> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post deleted successfully"));
    }
}
