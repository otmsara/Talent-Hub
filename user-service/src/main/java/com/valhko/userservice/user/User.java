package com.valhko.userservice.user;

import com.valhko.userservice.badge.Badge;
import com.valhko.userservice.network.Network;
import com.valhko.userservice.role.Role;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Table(name = "\"user\"", indexes = { @Index(columnList = "username", unique = true),
        @Index(columnList = "email", unique = true) })
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private String email;
    private String bio;
    private String avatarUrl;
    private String preferences;
    private LocalDate birthDate;
    private String title;
    private String country;
    private String city;
    private String jobCompany;
    private String bannerImageUrl;
    private String provider;
    private String providerId;

    @Builder.Default
    private Boolean disabled = false;

    @Builder.Default
    @OneToMany(mappedBy = "owner", fetch = FetchType.EAGER)
    private List<Badge> badges = new ArrayList<>();

    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Builder.Default
    @OneToMany(mappedBy = "networked", cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    private List<Network> networking = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "networking", cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.LAZY)
    private List<Network> networked = new ArrayList<>();

    @Builder.Default
    @ManyToMany(fetch = FetchType.LAZY)
    private Set<Role> roles = new HashSet<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public int getNetworkingCount() {
        if (networking == null) {
            networking = new ArrayList<>();
        }
        return networking.size();
    }

    public int getNetworkedCount() {
        if (networked == null) {
            networked = new ArrayList<>();
        }
        return networked.size();
    }

    public void addToNetworking(User networking) {
        this.networking.add(Network.builder()
                .networked(this)
                .networking(networking)
                .build());
    }

    public void removeFromNetworking(User networking) {
        this.networking = this.networking.stream()
                .filter(network -> !network.getNetworked().getId().equals(this.getId())
                        && !network.getNetworking().getId().equals(networking.getId()))
                .collect(Collectors.toList());
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }
}