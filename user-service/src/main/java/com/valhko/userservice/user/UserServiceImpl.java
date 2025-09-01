package com.valhko.userservice.user;

import com.valhko.common.outbox.OutboxEventService;
import com.valhko.common.system.config.UserContextHolder;
import com.valhko.common.system.exception.InvalidArgumentsException;
import com.valhko.common.system.exception.ResourceNotFoundException;
import com.valhko.common.system.util.DataUtils;
import com.valhko.userservice.badge.Badge;
import com.valhko.userservice.badge.BadgeRepo;
import com.valhko.userservice.badge.util.BadgeStatus;
import com.valhko.userservice.badge.util.BadgeType;
import com.valhko.userservice.role.RoleRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepo repo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final OutboxEventService outboxEventService;
    private final BadgeRepo badgeRepo;

    private final List<String> validPreferences = List.of("Web Development",
            "Mobile Development",
            "UI/UX Design",
            "Data Science",
            "Machine Learning",
            "AI Engineering",
            "Game Development",
            "Cybersecurity",
            "Cloud Computing",
            "DevOps",
            "Blockchain",
            "Product Management",
            "Graphic Design",
            "3D Modeling",
            "Animation",
            "Creative Writing");

    @Transactional
    @Override
    public User register(User user) {
        if (repo.existsByEmail(user.getEmail()))
            throw new InvalidArgumentsException("The email is already taken");

        user.addRole(roleRepo.findByName("ROLE_USER"));

        if (user.getPassword() != null)
            user.setPassword(passwordEncoder.encode(user.getPassword()));

        return repo.save(user);

        //outboxEventService.saveUserUpsertEvent(savedUser);
    }

    @Override
    public User getMe() {
        return repo.findByEmail(UserContextHolder.getUserInfo().email())
                .orElseThrow(() -> new ResourceNotFoundException("The user was not found"));
    }

    @Override
    public User getProfile(String username) {
        return repo.findByUsernameOrId(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("The user's profile was not found"));
    }


    @Override
    public Page<User> getNetworkingList(String userId, Pageable pageable) {
        return repo.findByNetworkedNetworkedId(userId, pageable);
    }

    @Override
    public Page<User> getNetworkedList(String userId, Pageable pageable) {
        return repo.findByNetworkingNetworkingId(userId, pageable);
    }

    @Override
    public Page<User> findByCriteria(Map<String, String> searchCriteria, Pageable pageable) {
        Specification<User> specification = Specification.where(null);

        String username = searchCriteria.get("username");
        String firstName = searchCriteria.get("firstName");
        String lastName = searchCriteria.get("lastName");
        String fullName = searchCriteria.get("fullName");

        if (StringUtils.hasLength(username))
            specification = specification.and(UserSpecs.containsUsername(username));
        if (StringUtils.hasLength(firstName))
            specification = specification.and(UserSpecs.containsFirstName(firstName));
        if (StringUtils.hasLength(lastName))
            specification = specification.and(UserSpecs.containsLastName(lastName));
        if (StringUtils.hasLength(fullName))
            specification = specification.and(UserSpecs.containsFullName(fullName));


        return repo.findAll(specification, pageable);
    }

    @Override
    public User verifyCredentials(String email, String password) {
        User user = repo.findByEmail(email).orElse(null);

        if (user != null) {
            boolean isMatched = passwordEncoder.matches(password, user.getPassword());
            return isMatched ? user : null;
        }

        return null;
    }

    @Transactional
    @Override
    public User update(User user) {
        User existingUser = repo.findById(UserContextHolder.userId())
                .orElseThrow(() -> new ResourceNotFoundException("The user was not found"));

        if (user.getUsername() != null) {
            if (existingUser.getUsername() == null || !existingUser.getUsername().equals(user.getUsername()))
                if (repo.existsByUsername(user.getUsername()))
                    throw new InvalidArgumentsException("The username '" + user.getUsername() + "' is already taken");

            existingUser.setUsername(user.getUsername());
        }

        if (user.getFirstName() != null)
            existingUser.setFirstName(user.getFirstName());

        if (user.getLastName() != null)
            existingUser.setLastName(user.getLastName());

        if (user.getBio() != null)
            existingUser.setBio(user.getBio());

        if (user.getTitle() != null)
            existingUser.setTitle(user.getTitle());

        if (user.getJobCompany() != null)
            existingUser.setJobCompany(user.getJobCompany());

        if (user.getCity() != null)
            existingUser.setCity(user.getCity());

        if (user.getAvatarUrl() != null)
            existingUser.setAvatarUrl(user.getAvatarUrl());

        if (user.getBirthDate() != null)
            existingUser.setBirthDate(user.getBirthDate());

        if (user.getBannerImageUrl() != null)
            existingUser.setBannerImageUrl(user.getBannerImageUrl());

        if (user.getCountry() != null) {
            if (!user.getCountry().isEmpty()) {
                List<String> countries = DataUtils.getCountries();
                if (!countries.contains(user.getCountry())) {
                    throw new InvalidArgumentsException("Invalid country provided: " + user.getCountry() +
                            ". Allowed countries are: " + String.join(", ", countries));
                }
                existingUser.setCountry(user.getCountry());
            } else {
                existingUser.setCountry(null);
            }
        }

        if (user.getPreferences() != null) {
            if (!user.getPreferences().isEmpty()) {
                var preferences = user.getPreferences().split(",");
                var newPreferences = new ArrayList<String>();
                for (var item : preferences) {
                    if (validPreferences.contains(item))
                        newPreferences.add(item);
                }
                existingUser.setPreferences(newPreferences.toString());
            } else {
                existingUser.setPreferences(null);
            }
        }

        return repo.save(existingUser);
    }

    @Override
    public void updatePassword(String oldPassword, String newPassword, String confirmPassword) {
        if (!newPassword.equals(confirmPassword))
            throw new InvalidArgumentsException("The new password and the confirm password don't match");

        User user = repo.findById(UserContextHolder.userId())
                .orElseThrow(() -> new ResourceNotFoundException("The user was not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword()))
            throw new InvalidArgumentsException("The old password is not correct");

        user.setPassword(passwordEncoder.encode(newPassword));

        repo.save(user);
    }

    @Override
    public User findById(String userId) {
        return repo.findById(userId).orElseThrow(() -> new ResourceNotFoundException("The user was not found"));
    }

    @Override
    public User findByEmail(String email) {
        return repo.findByEmail(email).orElseThrow(() -> new ResourceNotFoundException("The user was not found"));
    }

    @Override
    public Page<User> getSuggestions(Pageable pageable) {
        String userId = UserContextHolder.userId();

        Page<String> suggestionIdsPage = repo.findFriendsOfFriendsSuggestionIdsByUserId(userId, pageable);

        var suggestionIds = suggestionIdsPage.getContent();

        if (suggestionIds.isEmpty())
            return repo.findPopularUsers(userId, pageable);

        var users = repo.findAllById(suggestionIds);

        Map<String, User> userMap = users.stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        var orderedUsers = suggestionIds.stream()
                .map(userMap::get)
                .filter(Objects::nonNull)
                .toList();

        return new PageImpl<>(orderedUsers, pageable, suggestionIdsPage.getTotalElements());
    }

    @Override
    public void updateUserStatus(String userId, Boolean active) {
        /*var user = repo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("The user was not found"));

        user.setActive(active);

        repo.save(user);*/
    }

    @Override
    public Page<User> findAll(Pageable pageable) {

        return repo.findAll(pageable);
    }
}