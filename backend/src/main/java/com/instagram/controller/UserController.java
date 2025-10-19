package com.instagram.controller;

import com.instagram.dto.MessageResponse;
import com.instagram.dto.UserResponse;
import com.instagram.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    private final UserService userService;
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        return ResponseEntity.ok(new UserResponse(userService.getCurrentUser()));
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@RequestBody Map<String, String> updates) {
        return ResponseEntity.ok(userService.updateProfile(
                updates.get("fullName"),
                updates.get("bio"),
                updates.get("profilePicture")
        ));
    }
    
    @PostMapping("/{userId}/follow")
    public ResponseEntity<MessageResponse> followUser(@PathVariable Long userId) {
        userService.followUser(userId);
        return ResponseEntity.ok(new MessageResponse("User followed successfully"));
    }
    
    @DeleteMapping("/{userId}/follow")
    public ResponseEntity<MessageResponse> unfollowUser(@PathVariable Long userId) {
        userService.unfollowUser(userId);
        return ResponseEntity.ok(new MessageResponse("User unfollowed successfully"));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        return ResponseEntity.ok(userService.searchUsers(query));
    }
    
    @GetMapping("/{userId}/followers")
    public ResponseEntity<List<UserResponse>> getFollowers(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowers(userId));
    }
    
    @GetMapping("/{userId}/following")
    public ResponseEntity<List<UserResponse>> getFollowing(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFollowing(userId));
    }
}
