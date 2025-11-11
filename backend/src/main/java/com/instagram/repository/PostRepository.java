package com.instagram.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.instagram.model.Post;
import com.instagram.model.User;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    List<Post> findByUserOrderByCreatedAtDesc(User user);
    
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM Post p WHERE p.user IN :users ORDER BY p.createdAt DESC")
    List<Post> findPostsByUsers(List<User> users);
    
    @Query("SELECT p FROM Post p ORDER BY p.createdAt DESC")
    List<Post> findAllOrderByCreatedAtDesc();

    @Query("SELECT p FROM User u JOIN u.savedPosts p WHERE u = :user ORDER BY p.createdAt DESC")
    List<Post> findSavedPostsByUser(User user);
}
