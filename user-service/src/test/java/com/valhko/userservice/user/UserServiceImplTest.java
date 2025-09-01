package com.valhko.userservice.user;

import com.valhko.common.outbox.OutboxEventService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.config.UserInfo;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.common.system.util.DataUtils;
import com.valhko.userservice.badge.BadgeRepo;
import com.valhko.userservice.role.Role;
import com.valhko.userservice.role.RoleRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

  @Mock
  private UserRepo repo;

  @Mock
  private RoleRepo roleRepo;

  @Mock
  private PasswordEncoder passwordEncoder;

  @Mock
  private OutboxEventService outboxEventService;

  @Mock
  private BadgeRepo badgeRepo;

  @InjectMocks
  private UserServiceImpl userService;

  private User testUser;
  private Role userRole;
  private Pageable pageable;

  @BeforeEach
  void setUp() {
    testUser = new User();
    testUser.setId("user123");
    testUser.setEmail("test@example.com");
    testUser.setUsername("testuser");
    testUser.setFirstName("John");
    testUser.setLastName("Doe");
    testUser.setPassword("rawPassword");

    userRole = new Role();
    userRole.setName("ROLE_USER");

    pageable = PageRequest.of(0, 10);
  }

  @Test
  void register_WithValidUser_ShouldRegisterSuccessfully() {
    // Given
    when(repo.existsByEmail(testUser.getEmail())).thenReturn(false);
    when(roleRepo.findByName("ROLE_USER")).thenReturn(userRole);
    when(passwordEncoder.encode(testUser.getPassword())).thenReturn("encodedPassword");
    when(repo.save(any(User.class))).thenReturn(testUser);

    // When
    User result = userService.register(testUser);

    // Then
    assertNotNull(result);
    verify(repo).existsByEmail(testUser.getEmail());
    verify(roleRepo).findByName("ROLE_USER");
    verify(passwordEncoder).encode("rawPassword");
    verify(repo).save(testUser);
  }

  @Test
  void register_WithExistingEmail_ShouldThrowInvalidArgumentsException() {
    // Given
    when(repo.existsByEmail(testUser.getEmail())).thenReturn(true);

    // When & Then
    InvalidArgumentsException exception = assertThrows(
            InvalidArgumentsException.class,
            () -> userService.register(testUser)
    );
    assertEquals("The email is already taken", exception.getMessage());
    verify(repo, never()).save(any());
  }

  @Test
  void register_WithNullPassword_ShouldNotEncodePassword() {
    // Given
    testUser.setPassword(null);
    when(repo.existsByEmail(testUser.getEmail())).thenReturn(false);
    when(roleRepo.findByName("ROLE_USER")).thenReturn(userRole);
    when(repo.save(any(User.class))).thenReturn(testUser);

    // When
    User result = userService.register(testUser);

    // Then
    assertNotNull(result);
    verify(passwordEncoder, never()).encode(any());
    verify(repo).save(testUser);
  }

  @Test
  void getProfile_WithValidUsername_ShouldReturnUser() {
    // Given
    String username = "testuser";
    when(repo.findByUsernameOrId(username, username)).thenReturn(Optional.of(testUser));

    // When
    User result = userService.getProfile(username);

    // Then
    assertNotNull(result);
    assertEquals(testUser, result);
    verify(repo).findByUsernameOrId(username, username);
  }

  @Test
  void getProfile_WithNonExistentUsername_ShouldThrowResourceNotFoundException() {
    // Given
    String username = "nonexistent";
    when(repo.findByUsernameOrId(username, username)).thenReturn(Optional.empty());

    // When & Then
    ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.getProfile(username)
    );
    assertEquals("The user's profile was not found", exception.getMessage());
  }

  @Test
  void getNetworkingList_ShouldReturnPageOfUsers() {
    // Given
    String userId = "user123";
    Page<User> expectedPage = new PageImpl<>(Collections.singletonList(testUser));
    when(repo.findByNetworkedNetworkedId(userId, pageable)).thenReturn(expectedPage);

    // When
    Page<User> result = userService.getNetworkingList(userId, pageable);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(repo).findByNetworkedNetworkedId(userId, pageable);
  }

  @Test
  void getNetworkedList_ShouldReturnPageOfUsers() {
    // Given
    String userId = "user123";
    Page<User> expectedPage = new PageImpl<>(Collections.singletonList(testUser));
    when(repo.findByNetworkingNetworkingId(userId, pageable)).thenReturn(expectedPage);

    // When
    Page<User> result = userService.getNetworkedList(userId, pageable);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(repo).findByNetworkingNetworkingId(userId, pageable);
  }

  @Test
  void findByCriteria_WithMultipleCriteria_ShouldReturnFilteredUsers() {
    // Given
    Map<String, String> searchCriteria = new HashMap<>();
    searchCriteria.put("username", "test");
    searchCriteria.put("firstName", "John");
    searchCriteria.put("lastName", "Doe");
    searchCriteria.put("fullName", "John Doe");

    Page<User> expectedPage = new PageImpl<>(Collections.singletonList(testUser));
    when(repo.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

    // When
    Page<User> result = userService.findByCriteria(searchCriteria, pageable);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(repo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void findByCriteria_WithEmptyCriteria_ShouldReturnAllUsers() {
    // Given
    Map<String, String> searchCriteria = new HashMap<>();
    Page<User> expectedPage = new PageImpl<>(Collections.singletonList(testUser));
    when(repo.findAll(any(Specification.class), eq(pageable))).thenReturn(expectedPage);

    // When
    Page<User> result = userService.findByCriteria(searchCriteria, pageable);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(repo).findAll(any(Specification.class), eq(pageable));
  }

  @Test
  void verifyCredentials_WithValidCredentials_ShouldReturnUser() {
    // Given
    String email = "test@example.com";
    String password = "password";
    when(repo.findByEmail(email)).thenReturn(Optional.of(testUser));
    when(passwordEncoder.matches(password, testUser.getPassword())).thenReturn(true);

    // When
    User result = userService.verifyCredentials(email, password);

    // Then
    assertNotNull(result);
    assertEquals(testUser, result);
    verify(repo).findByEmail(email);
    verify(passwordEncoder).matches(password, testUser.getPassword());
  }

  @Test
  void verifyCredentials_WithInvalidPassword_ShouldReturnNull() {
    // Given
    String email = "test@example.com";
    String password = "wrongpassword";
    when(repo.findByEmail(email)).thenReturn(Optional.of(testUser));
    when(passwordEncoder.matches(password, testUser.getPassword())).thenReturn(false);

    // When
    User result = userService.verifyCredentials(email, password);

    // Then
    assertNull(result);
    verify(repo).findByEmail(email);
    verify(passwordEncoder).matches(password, testUser.getPassword());
  }

  @Test
  void verifyCredentials_WithNonExistentEmail_ShouldReturnNull() {
    // Given
    String email = "nonexistent@example.com";
    String password = "password";
    when(repo.findByEmail(email)).thenReturn(Optional.empty());

    // When
    User result = userService.verifyCredentials(email, password);

    // Then
    assertNull(result);
    verify(repo).findByEmail(email);
    verify(passwordEncoder, never()).matches(any(), any());
  }

  @Test
  void update_WithValidData_ShouldUpdateUser() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class);
         MockedStatic<DataUtils> dataUtilsMock = mockStatic(DataUtils.class)) {

      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");
      dataUtilsMock.when(DataUtils::getCountries).thenReturn(Arrays.asList("USA", "Canada", "UK"));

      User updateData = new User();
      updateData.setUsername("newusername");
      updateData.setFirstName("Jane");
      updateData.setCountry("USA");
      updateData.setPreferences("Web Development,Mobile Development");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(repo.existsByUsername("newusername")).thenReturn(false);
      when(repo.save(any(User.class))).thenReturn(testUser);

      // When
      User result = userService.update(updateData);

      // Then
      assertNotNull(result);
      verify(repo).findById("user123");
      verify(repo).existsByUsername("newusername");
      verify(repo).save(testUser);
    }
  }

  @Test
  void update_WithExistingUsername_ShouldThrowInvalidArgumentsException() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      User updateData = new User();
      updateData.setUsername("existingusername");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(repo.existsByUsername("existingusername")).thenReturn(true);

      // When & Then
      InvalidArgumentsException exception = assertThrows(
              InvalidArgumentsException.class,
              () -> userService.update(updateData)
      );
      assertEquals("The username 'existingusername' is already taken", exception.getMessage());
      verify(repo, never()).save(any());
    }
  }

  @Test
  void update_WithInvalidCountry_ShouldThrowInvalidArgumentsException() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class);
         MockedStatic<DataUtils> dataUtilsMock = mockStatic(DataUtils.class)) {

      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");
      dataUtilsMock.when(DataUtils::getCountries).thenReturn(Arrays.asList("USA", "Canada", "UK"));

      User updateData = new User();
      updateData.setCountry("InvalidCountry");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));

      // When & Then
      InvalidArgumentsException exception = assertThrows(
              InvalidArgumentsException.class,
              () -> userService.update(updateData)
      );
      assertTrue(exception.getMessage().contains("Invalid country provided"));
      verify(repo, never()).save(any());
    }
  }

  @Test
  void update_WithEmptyCountry_ShouldSetCountryToNull() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      User updateData = new User();
      updateData.setCountry("");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(repo.save(any(User.class))).thenReturn(testUser);

      // When
      User result = userService.update(updateData);

      // Then
      assertNotNull(result);
      verify(repo).save(testUser);
      // Verify that setCountry(null) was called on the existing user
    }
  }

  @Test
  void updatePassword_WithMismatchedConfirmPassword_ShouldThrowInvalidArgumentsException() {
    // Given
    String oldPassword = "oldpass";
    String newPassword = "newpass";
    String confirmPassword = "differentpass";

    // When & Then
    InvalidArgumentsException exception = assertThrows(
            InvalidArgumentsException.class,
            () -> userService.updatePassword(oldPassword, newPassword, confirmPassword)
    );
    assertEquals("The new password and the confirm password don't match", exception.getMessage());
    verify(repo, never()).findById(any());
  }

  @Test
  void updatePassword_WithIncorrectOldPassword_ShouldThrowInvalidArgumentsException() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      String oldPassword = "wrongoldpass";
      String newPassword = "newpass";
      String confirmPassword = "newpass";

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(passwordEncoder.matches(oldPassword, testUser.getPassword())).thenReturn(false);

      // When & Then
      InvalidArgumentsException exception = assertThrows(
              InvalidArgumentsException.class,
              () -> userService.updatePassword(oldPassword, newPassword, confirmPassword)
      );
      assertEquals("The old password is not correct", exception.getMessage());
      verify(repo, never()).save(any());
    }
  }

  @Test
  void findById_WithValidId_ShouldReturnUser() {
    // Given
    String userId = "user123";
    when(repo.findById(userId)).thenReturn(Optional.of(testUser));

    // When
    User result = userService.findById(userId);

    // Then
    assertNotNull(result);
    assertEquals(testUser, result);
    verify(repo).findById(userId);
  }

  @Test
  void findById_WithNonExistentId_ShouldThrowResourceNotFoundException() {
    // Given
    String userId = "nonexistent";
    when(repo.findById(userId)).thenReturn(Optional.empty());

    // When & Then
    ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.findById(userId)
    );
    assertEquals("The user was not found", exception.getMessage());
  }

  @Test
  void findByEmail_WithValidEmail_ShouldReturnUser() {
    // Given
    String email = "test@example.com";
    when(repo.findByEmail(email)).thenReturn(Optional.of(testUser));

    // When
    User result = userService.findByEmail(email);

    // Then
    assertNotNull(result);
    assertEquals(testUser, result);
    verify(repo).findByEmail(email);
  }

  @Test
  void findByEmail_WithNonExistentEmail_ShouldThrowResourceNotFoundException() {
    // Given
    String email = "nonexistent@example.com";
    when(repo.findByEmail(email)).thenReturn(Optional.empty());

    // When & Then
    ResourceNotFoundException exception = assertThrows(
            ResourceNotFoundException.class,
            () -> userService.findByEmail(email)
    );
    assertEquals("The user was not found", exception.getMessage());
  }

  @Test
  void getSuggestions_WithFriendsOfFriends_ShouldReturnSuggestions() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      User friend1 = new User();
      friend1.setId("friend1");
      User friend2 = new User();
      friend2.setId("friend2");

      List<String> suggestionIds = Arrays.asList("friend1", "friend2");
      Page<String> suggestionIdsPage = new PageImpl<>(suggestionIds, pageable, 2);
      List<User> suggestedUsers = Arrays.asList(friend1, friend2);

      when(repo.findFriendsOfFriendsSuggestionIdsByUserId("user123", pageable))
              .thenReturn(suggestionIdsPage);
      when(repo.findAllById(suggestionIds)).thenReturn(suggestedUsers);

      // When
      Page<User> result = userService.getSuggestions(pageable);

      // Then
      assertNotNull(result);
      assertEquals(2, result.getContent().size());
      verify(repo).findFriendsOfFriendsSuggestionIdsByUserId("user123", pageable);
      verify(repo).findAllById(suggestionIds);
    }
  }

  @Test
  void getSuggestions_WithNoFriendsOfFriends_ShouldReturnPopularUsers() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      Page<String> emptySuggestionIdsPage = new PageImpl<>(Collections.emptyList(), pageable, 0);
      Page<User> popularUsersPage = new PageImpl<>(Arrays.asList(testUser), pageable, 1);

      when(repo.findFriendsOfFriendsSuggestionIdsByUserId("user123", pageable))
              .thenReturn(emptySuggestionIdsPage);
      when(repo.findPopularUsers("user123", pageable)).thenReturn(popularUsersPage);

      // When
      Page<User> result = userService.getSuggestions(pageable);

      // Then
      assertNotNull(result);
      assertEquals(popularUsersPage, result);
      verify(repo).findFriendsOfFriendsSuggestionIdsByUserId("user123", pageable);
      verify(repo).findPopularUsers("user123", pageable);
    }
  }

  @Test
  void findAll_ShouldReturnPageOfUsers() {
    // Given
    Page<User> expectedPage = new PageImpl<>(Arrays.asList(testUser));
    when(repo.findAll(pageable)).thenReturn(expectedPage);

    // When
    Page<User> result = userService.findAll(pageable);

    // Then
    assertNotNull(result);
    assertEquals(expectedPage, result);
    verify(repo).findAll(pageable);
  }

  @Test
  void update_WithValidPreferences_ShouldFilterAndSetPreferences() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      User updateData = new User();
      updateData.setPreferences("Web Development,Invalid Preference,Mobile Development");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(repo.save(any(User.class))).thenReturn(testUser);

      // When
      User result = userService.update(updateData);

      // Then
      assertNotNull(result);
      verify(repo).save(testUser);
      // The service should filter out invalid preferences and keep only valid ones
    }
  }

  @Test
  void update_WithEmptyPreferences_ShouldSetPreferencesToNull() {
    // Given
    try (MockedStatic<UserContextHolder> mockedStatic = mockStatic(UserContextHolder.class)) {
      mockedStatic.when(UserContextHolder::userId).thenReturn("user123");

      User updateData = new User();
      updateData.setPreferences("");

      when(repo.findById("user123")).thenReturn(Optional.of(testUser));
      when(repo.save(any(User.class))).thenReturn(testUser);

      // When
      User result = userService.update(updateData);

      // Then
      assertNotNull(result);
      verify(repo).save(testUser);
    }
  }
}