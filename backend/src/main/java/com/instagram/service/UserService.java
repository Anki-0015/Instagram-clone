package com.instagram.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.instagram.dto.UserResponse;
import com.instagram.model.User;
import com.instagram.repository.UserRepository;
import com.instagram.security.UserDetailsImpl;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    
    public UserService(UserRepository userRepository, @Lazy NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    
    public User getCurrentUser() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserResponse response = new UserResponse(user);
        User currentUser = getCurrentUser();
        response.setFollowing(user.getFollowers().contains(currentUser));
        
        return response;
    }
    
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserResponse response = new UserResponse(user);
        User currentUser = getCurrentUser();
        response.setFollowing(user.getFollowers().contains(currentUser));
        
        return response;
    }
    
    @Transactional
    public UserResponse updateProfile(String fullName, String bio, String profilePicture) {
        User user = getCurrentUser();
        
        if (fullName != null) user.setFullName(fullName);
        if (bio != null) user.setBio(bio);
        if (profilePicture != null) user.setProfilePicture(profilePicture);
        
        userRepository.save(user);
        return new UserResponse(user);
    }
    
    @Transactional
    public void followUser(Long userId) {
        User currentUser = getCurrentUser();
        User userToFollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("You cannot follow yourself");
        }
        
        userToFollow.getFollowers().add(currentUser);
        currentUser.getFollowing().add(userToFollow);
        
        userRepository.save(userToFollow);
        userRepository.save(currentUser);
        
        // Create notification
        notificationService.createFollowNotification(userToFollow, currentUser);
    }
    
    @Transactional
    public void unfollowUser(Long userId) {
        User currentUser = getCurrentUser();
        User userToUnfollow = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userToUnfollow.getFollowers().remove(currentUser);
        currentUser.getFollowing().remove(userToUnfollow);
        
        userRepository.save(userToUnfollow);
        userRepository.save(currentUser);
    }
    
    public List<UserResponse> searchUsers(String query) {
        List<User> users = userRepository.searchUsers(query);
        User currentUser = getCurrentUser();
        
        return users.stream()
                .map(user -> {
                    UserResponse response = new UserResponse(user);
                    response.setFollowing(user.getFollowers().contains(currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getFollowers(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = getCurrentUser();
        
        return user.getFollowers().stream()
                .map(follower -> {
                    UserResponse response = new UserResponse(follower);
                    response.setFollowing(follower.getFollowers().contains(currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }
    
    public List<UserResponse> getFollowing(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User currentUser = getCurrentUser();
        
        return user.getFollowing().stream()
                .map(following -> {
                    UserResponse response = new UserResponse(following);
                    response.setFollowing(following.getFollowers().contains(currentUser));
                    return response;
                })
                .collect(Collectors.toList());
    }
}
